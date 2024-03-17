import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { changeToDocumentType } from '../utils';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';

const includeDocuments = {
  include: {
    documents: {
      select: {
        type: true,
        url: true,
      },
    },
  },
};

@Injectable()
export class OrganizationService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findOne(id: string, userId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: {
        id,
        users: {
          some: {
            id: userId,
          },
        },
      },
      ...includeDocuments,
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return this.getResponse(organization);
  }

  async create(
    dto: CreateOrganizationDto,
    userId: string,
    files: Array<Express.Multer.File>,
  ) {
    const organization = await this.prisma.organization.create({
      data: {
        name: dto.name,
        founderId: userId,
        TIN: dto.TIN,
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });

    const uploadPromises = files.map((file) =>
      this.uploadDocument(file, organization.id),
    );
    await Promise.all(uploadPromises);

    const createdOrganization = await this.prisma.organization.findUnique({
      where: {
        founderId: userId,
        id: organization.id,
      },
      ...includeDocuments,
    });

    return this.getResponse(createdOrganization);
  }

  async update(
    id: string,
    dto: UpdateOrganizationDto,
    userId: string,
    files: Array<Express.Multer.File>,
  ) {
    const organization = await this.prisma.organization.update({
      where: {
        id,
        users: {
          some: {
            id: userId,
          },
        },
      },
      data: {
        name: dto.name,
        TIN: dto.TIN,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const existingDocuments = await this.prisma.document.findMany({
      where: { organizationId: id },
    });

    const documentUpdates = files.map((file) =>
      this.handleDocumentUpdate(file, id, existingDocuments),
    );

    await Promise.all(documentUpdates);
    await this.removeUnprovidedDocuments(dto, files, existingDocuments);

    return await this.findOne(id, userId);
  }

  private getResponse(organization) {
    const documents = organization.documents?.reduce((acc, doc) => {
      acc[doc.type] = doc.url;
      return acc;
    }, {});

    return {
      documents,
      id: organization.id,
      name: organization.name,
      TIN: organization.TIN,
      founderId: organization.founderId,
    };
  }

  private async uploadDocument(
    file: Express.Multer.File,
    organizationId: string,
  ) {
    const documentType: DocumentType | null = changeToDocumentType(
      file.fieldname,
    );
    try {
      const documentFromCloudinary =
        await this.cloudinaryService.uploadDocument(file);

      return this.prisma.document.create({
        data: {
          organizationId,
          type: documentType,
          url: documentFromCloudinary?.url,
          publicId: documentFromCloudinary?.public_id,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'organization-uploadDocument', error });
    }
  }

  private async handleDocumentUpdate(
    file: Express.Multer.File,
    organizationId: string,
    existingDocuments: Array<{
      id: string;
      type: DocumentType;
      publicId: string;
    }>,
  ) {
    const documentType = changeToDocumentType(file.fieldname);
    const existingDocument = existingDocuments.find(
      (doc) => doc.type === documentType,
    );

    if (existingDocument) {
      await this.removeDocument(existingDocument);
    }

    return await this.uploadDocument(file, organizationId);
  }

  private async removeUnprovidedDocuments(
    dto: UpdateOrganizationDto,
    files: Array<Express.Multer.File>,
    existingDocuments: Array<{
      id: string;
      type: DocumentType;
      publicId: string;
    }>,
  ) {
    const providedDocumentTypes = new Set([
      ...Object.keys(dto),
      ...files.map((file) => changeToDocumentType(file.fieldname)),
    ]);

    const documentsToRemove = existingDocuments.filter(
      (doc) => !providedDocumentTypes.has(doc.type.toString()),
    );

    const removePromises = documentsToRemove.map(
      async (doc) => await this.removeDocument(doc),
    );

    await Promise.all(removePromises);
  }

  private async removeDocument(document) {
    try {
      await this.cloudinaryService.deleteFile(document.publicId);
      await this.prisma.document.delete({ where: { id: document.id } });
    } catch (error) {
      this.logger.error({ method: 'organization-removeDocument', error });
    }
  }
}

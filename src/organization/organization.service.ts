import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { changeToDocumentType } from '../utils';
import { CreateOrganizationDto } from './dto';

@Injectable()
export class OrganizationService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private transformDocuments(documents) {
    return documents.reduce((acc, doc) => {
      acc[doc.type] = doc.url;
      return acc;
    }, {});
  }

  private getResponse(organization) {
    return {
      documents: this.transformDocuments(organization.documents),
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
      this.logger.error({ method: 'organization-document-upload', error });
    }
  }

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
      include: {
        documents: {
          select: {
            type: true,
            url: true,
          },
        },
      },
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
      include: {
        documents: {
          select: {
            type: true,
            url: true,
          },
        },
      },
    });

    return this.getResponse(createdOrganization);
  }
}

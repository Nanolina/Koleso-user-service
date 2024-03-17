import { Injectable } from '@nestjs/common';
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
      },
    });

    const uploadPromises = files.map((file) =>
      (async () => {
        const documentType: DocumentType | null = changeToDocumentType(
          file.fieldname,
        );

        try {
          const documentFromCloudinary =
            await this.cloudinaryService.uploadDocument(file);
          return this.prisma.document.create({
            data: {
              organizationId: organization.id,
              type: documentType,
              url: documentFromCloudinary?.url,
              publicId: documentFromCloudinary?.public_id,
            },
          });
        } catch (error) {
          this.logger.error({ method: 'document-upload', error });
          return null; // Return null to handle the rejection softly
        }
      })(),
    );

    // Wait for all documents to be uploaded
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

    // Transform documents to the desired format
    const documents = createdOrganization.documents.reduce(
      (acc, doc) => ({ ...acc, [doc.type]: doc.url }),
      {},
    );

    return {
      documents,
      id: createdOrganization.id,
      name: createdOrganization.name,
      TIN: createdOrganization.TIN,
      founderId: createdOrganization.founderId,
    };
  }
}

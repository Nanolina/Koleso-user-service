import { BadRequestException } from '@nestjs/common';
import { DocumentType } from '@prisma/client';

export const changeToDocumentType = (document: string): DocumentType | null => {
  if (Object.values(DocumentType).includes(document as DocumentType)) {
    return document as DocumentType;
  }

  throw new BadRequestException(`Invalid document type: ${document}`);
};

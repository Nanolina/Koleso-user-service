import { LanguageType } from '@prisma/client';
import { IsDefined, IsUUID, Validate } from 'class-validator';
import { IsValidLanguageConstraint } from '../validators';

export class ChangeLanguageDto {
  @IsDefined()
  @Validate(IsValidLanguageConstraint)
  language: LanguageType;
}

export class ChangeLanguageServiceDto extends ChangeLanguageDto {
  @IsUUID()
  id: string;
}

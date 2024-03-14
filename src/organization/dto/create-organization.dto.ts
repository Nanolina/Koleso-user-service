import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsOptional()
  TIN?: string;
}

import { IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  TIN?: string;

  @IsOptional()
  @IsString()
  Passport?: string;

  @IsOptional()
  @IsString()
  CertificateOfRegistration?: string;

  @IsOptional()
  @IsString()
  CertificateOfDirectorsAndSecretary?: string;

  @IsOptional()
  @IsString()
  CertificateOfRegisteredOffice?: string;

  @IsOptional()
  @IsString()
  CertificateOfShareholders?: string;

  @IsOptional()
  @IsString()
  CertificateTaxResidency?: string;
}

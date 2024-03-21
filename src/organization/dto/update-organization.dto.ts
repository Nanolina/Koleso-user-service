import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  TIN?: string;

  @IsOptional()
  @IsUrl()
  Passport?: string;

  @IsOptional()
  @IsUrl()
  CertificateOfRegistration?: string;

  @IsOptional()
  @IsUrl()
  CertificateOfDirectorsAndSecretary?: string;

  @IsOptional()
  @IsUrl()
  CertificateOfRegisteredOffice?: string;

  @IsOptional()
  @IsUrl()
  CertificateOfShareholders?: string;

  @IsOptional()
  @IsUrl()
  CertificateTaxResidency?: string;
}

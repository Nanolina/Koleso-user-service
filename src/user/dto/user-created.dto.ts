import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UserCreatedDto {
  @IsOptional()
  @IsString()
  eventType?: string;

  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsDefined()
  code: number;

  @IsDefined()
  codeType: string;
}

import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { IsValidVerificationCodeConstraint } from '../validators';

export class UserCreatedDto {
  @IsOptional()
  @IsString()
  eventType?: string;

  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsDefined()
  @Validate(IsValidVerificationCodeConstraint)
  verificationCodeEmail: number;
}

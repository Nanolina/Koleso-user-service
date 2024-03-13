import { LanguageType } from '@prisma/client';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidLanguage', async: false })
export class IsValidLanguageConstraint implements ValidatorConstraintInterface {
  validate(language: any) {
    const languageValues = Object.values(LanguageType) as string[];
    return typeof language === 'string' && languageValues.includes(language);
  }

  defaultMessage() {
    return 'The language is incorrect';
  }
}

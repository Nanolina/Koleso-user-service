import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../enums/gender.enum';
import { Language } from '../enums/language.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 20 })
  phoneNumber: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'enum', enum: Language, default: Language.English })
  language: Language;

  @Column('boolean', { default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { LoggerModule } from './logger/logger.module';
import { OrganizationModule } from './organization/organization.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    LoggerModule,
    CloudinaryModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrganizationModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

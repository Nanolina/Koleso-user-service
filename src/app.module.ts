import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [PrismaService],
})
export class AppModule {}

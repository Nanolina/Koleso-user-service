import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserEventsController } from './events';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [LoggerModule, AuthModule],
  controllers: [UserEventsController, UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}

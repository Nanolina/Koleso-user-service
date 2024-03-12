import { Injectable } from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserCreatedDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async create(dto: UserCreatedDto) {
    try {
      await this.prisma.user.create({
        data: {
          id: dto.id,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'create', error });
    }
  }
}

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UNKNOWN_ERROR_TRY } from '../consts';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeLanguageServiceDto, UserCreatedDto } from './dto';

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
      this.logger.error({ method: 'user-create', error });
    }
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      language: user.language,
      organizationId: user.organizationId,
    };
  }

  async changeLanguage(dto: ChangeLanguageServiceDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: dto.id,
        },
        data: {
          language: dto.language,
        },
      });

      return {
        language: user.language,
      };
    } catch (error) {
      this.logger.error({ method: 'user-changeLanguage', error });
      throw new InternalServerErrorException(UNKNOWN_ERROR_TRY);
    }
  }
}

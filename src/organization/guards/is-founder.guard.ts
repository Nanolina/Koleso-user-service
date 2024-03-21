import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IsFounderGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;

    const organization = await this.prisma.organization.findUnique({
      where: { id: params.id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (organization.founderId !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to update this organization',
      );
    }

    return true;
  }
}

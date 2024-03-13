import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ChangeLanguageDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findOne(@Req() req: Request) {
    return this.userService.findOne(req.user.id);
  }

  @Patch('/change-language')
  @HttpCode(HttpStatus.OK)
  async changeLanguage(
    @Req() req: Request,
    @Body() dto: ChangeLanguageDto,
  ): Promise<ChangeLanguageDto> {
    return await this.userService.changeLanguage({
      id: req.user.id,
      language: dto.language,
    });
  }
}

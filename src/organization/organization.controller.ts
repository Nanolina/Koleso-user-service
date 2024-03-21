import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';
import { IsFounderGuard } from './guards';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.organizationService.findOne(id, req.user.id);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateOrganizationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    return this.organizationService.create(dto, req.user.id, files);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  @UseGuards(IsFounderGuard)
  update(
    @Body() dto: UpdateOrganizationDto,
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    return this.organizationService.update(id, dto, req.user.id, files);
  }
}

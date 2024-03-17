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
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CreateOrganizationDto } from './dto';
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
  // @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(
    @Param('id') id: string,
    // @UploadedFile() image: Express.Multer.File,
    @Req() req: Request,
  ) {
    console.log('req', req.user.id);
    // return this.organizationService.update(
    //   updateStoreDto,
    //   id,
    //   req.user.id,
    //   image,
    // );
  }
}

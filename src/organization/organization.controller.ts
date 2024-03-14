import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateOrganizationDto } from './dto';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  // @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateOrganizationDto,
    // @UploadedFile() image: Express.Multer.File,
    @Req() req: Request,
  ) {
    console.log('dto', dto);
    console.log('req', req.user.id);
    // return this.organizationService.create(createStoreDto, req.user.id, image);
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

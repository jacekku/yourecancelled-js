/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID, UUID } from 'crypto';
import * as sharp from 'sharp';
import { RestrictedTo } from '../auth/RestrictedTo.decorator';
import { User } from '../auth/User.decorator';
import { ImagesRepository } from './Images.repository';
import { S3Service } from './S3.service';

@Controller('images')
@RestrictedTo(['User'])
export class ImagesController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly imagesRepo: ImagesRepository,
  ) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @User('id') userId: UUID,
  ) {
    const resizedImage = await this.resizeImage(file.buffer);
    const key = `${userId}-${randomUUID()}.jpg`;
    await this.imagesRepo.saveUserConnection(key, userId);
    const url = await this.s3Service.uploadFile(resizedImage, key);
    return { url };
  }

  @Get(':key')
  async getImageUrl(@Param('key') key: string, @User('id') userId: UUID) {
    // Check if the user is authorized to access the image
    const isAuthorized = await this.checkAuthorization(key, userId);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    const url = await this.s3Service.getFileUrl(key);
    return { url };
  }

  @Put(':key/access/:grantee')
  async grantAccess(@Param('key') key: string, @Param('grantee') grantee: UUID, @User('id') ownerId: UUID) {
    const isAuthorized = await this.checkAuthorization(key, ownerId);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.imagesRepo.saveUserConnection(key, grantee);
  }

  async resizeImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).toBuffer();
  }

  private async checkAuthorization(
    key: string,
    userId: UUID,
  ): Promise<boolean> {
    const found = await this.imagesRepo.findKeyUserConnection(key, userId);
    return !!found;
  }
}

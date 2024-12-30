import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/Auth.module';
import { DatabaseModule } from '../common/database/Database.module';
import { ImagesController } from './Images.controller';
import { ImagesRepository } from './Images.repository';
import { S3Service } from './s3.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ImagesController],
  providers: [ImagesRepository, S3Service],
})
export class ImagesModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/Auth.module';
import { DatabaseModule } from '../common/database/Database.module';
import { ImagesController } from './Images.controller';
import { ImagesRepository } from './Images.repository';
import { S3Service } from './S3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ImagesController],
  providers: [
    ImagesRepository,
    S3Service,
    {
      provide: S3Client,
      useFactory: (configService: ConfigService) =>
        new S3Client({
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
        }),
      inject: [ConfigService],
    },
  ],
})
export class ImagesModule {}

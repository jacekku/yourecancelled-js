import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AuthModule } from '../auth/Auth.module';
import { databaseProvider } from './datasource';
import { ImagesController } from './Images.controller';
import { ImagesRepository } from './Images.repository';
import { S3Service } from './s3.service';

@Module({
  imports: [AuthModule],
  controllers: [ImagesController],
  providers: [
    {
      provide: DataSource,
      useFactory: async (config: ConfigService) => {
        const provider = databaseProvider(config);
        await provider.initialize();
        await provider.runMigrations();
        return provider;
      },
      inject: [ConfigService],
    },
    ImagesRepository,
    S3Service,
  ],
})
export class ImagesModule {}

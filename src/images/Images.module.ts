import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/Auth.module';
import { ImagesController } from './Images.controller';
import { ImagesRepository } from './Images.repository';
import { S3Service } from './s3.service';

@Module({
  imports: [AuthModule],
  controllers: [ImagesController],
  providers: [
    // {
    //   provide: DataSource,
    //   useFactory: async (config: ConfigService) => {
    //     // const provider = databaseProvider(config);
    //     // await provider.initialize();
    //     // await provider.runMigrations();
    //     // return provider;
    //   },
    //   inject: [ConfigService],
    // },
    ImagesRepository,
    S3Service,
  ],
})
export class ImagesModule {}

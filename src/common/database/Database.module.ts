import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { databaseProvider } from './postgresDatabase.provider';

@Module({
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
  ],
  exports: [DataSource],
})
export class DatabaseModule {}

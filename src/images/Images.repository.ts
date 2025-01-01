import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { randomUUID, UUID } from 'crypto';
import { DataSource } from 'typeorm';
import { ImageEntity } from './Image.entity';

@Injectable()
export class ImagesRepository {
  constructor(
    @InjectDataSource()
    private readonly ds: DataSource,
  ) {}

  public async saveUserConnection(key: string, userId: UUID) {
    await this.ds
      .createQueryBuilder(ImageEntity, 'images')
      .insert()
      .values({ id: randomUUID(), key, userId })
      .execute();
  }

  public async findKeyUserConnection(key: string, userId: UUID) {
    return this.ds
      .createQueryBuilder(ImageEntity, 'images')
      .select()
      .where('key = :key AND user_id = :userId', { key, userId })
      .getOne();
  }
}

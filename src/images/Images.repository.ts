import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { randomUUID, UUID } from 'crypto';
import { Column, DataSource, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('images')
@Index('images_key_user_id_idx', ['key', 'userId'])
export class ImageEntity {
  @PrimaryColumn()
  id: UUID;

  @Column({ nullable: false, name: 'key' })
  @Index('images_key_idx')
  key: string;

  @Column({ nullable: false, name: 'user_id' })
  @Index('images_user_id_idx')
  userId: UUID;

  @Column({ nullable: false, name: 'created_at' })
  createdAt: Date;
}

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
      .select('id')
      .where(`key = :key AND user_id = :userId`, { key, userId })
      .getOne();
  }
}

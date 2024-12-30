import { UUID } from 'crypto';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

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

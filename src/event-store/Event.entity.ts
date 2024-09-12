import { UUID } from 'crypto';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('identity', {
    type: 'bigint',
    name: 'global_position',
  })
  globalPosition: number;

  @Column({ nullable: false, unique: true, name: 'message_id' })
  @Index('message_id_idx', { unique: true })
  messageId: UUID;

  @Column({ nullable: false, name: 'message_type' })
  messageType: string;

  @Column({ nullable: false, name: 'stream_id' })
  @Index('stream_id_idx')
  streamId: string;

  @Column({ nullable: false, type: 'bigint', name: 'stream_position' })
  streamPosition: number;

  @Column({ type: 'jsonb', nullable: false, name: 'data' })
  data: object;

  @Column({ type: 'jsonb', nullable: false, name: 'metadata' })
  metadata: object;

  @Column({ type: 'timestamp', nullable: false, name: 'timestamp' })
  @Index('timestamp_idx')
  timestamp: Date;
}

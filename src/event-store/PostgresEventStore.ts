import {
  AggregateStreamOptions,
  AggregateStreamResult,
  AppendToStreamOptions,
  AppendToStreamResult,
  Event,
  ReadStreamOptions,
} from '@event-driven-io/emmett';
import { InjectDataSource } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { EventEntity } from './Event.entity';
import { EventStore } from './EventStore';

export class PostgresEventStore implements EventStore {
  constructor(
    @InjectDataSource()
    private readonly ds: DataSource,
  ) {}

  aggregateStream<State, EventType extends Event>(
    _streamName: string,
    _options: AggregateStreamOptions<State, EventType, bigint>,
  ): Promise<AggregateStreamResult<State, bigint>> {
    throw new Error('Method not implemented.');
  }

  async readStream<EventType extends Event>(
    streamName: string,
    _options?: ReadStreamOptions<bigint>,
  ): Promise<{ currentStreamVersion: bigint; events: EventType[] }> {
    const res = await this.ds
      .createQueryBuilder(EventEntity, 'event')
      .where('stream_id=:streamName', { streamName })
      .orderBy('stream_position')
      .getMany();
    return {
      currentStreamVersion: BigInt(res[res.length - 1].streamPosition),
      events: res.map(
        (event) =>
          ({
            data: event.data,
            metadata: event.metadata,
            type: event.messageType,
          }) as EventType,
      ),
    };
  }

  async appendToStream<EventType extends Event>(
    streamName: string,
    events: EventType[],
    options?: AppendToStreamOptions<bigint>,
  ): Promise<AppendToStreamResult<bigint>> {
    const dbLatest = await this.ds
      .createQueryBuilder(EventEntity, 'event')
      .orderBy('stream_position', 'DESC')
      .where('stream_id=:streamName', { streamName })
      .getOne();

    const latest = Number(dbLatest?.streamPosition ?? 1);

    if (
      options.expectedStreamVersion &&
      BigInt(latest) !== options.expectedStreamVersion
    ) {
      return {
        nextExpectedStreamVersion: BigInt(latest),
      };
    }

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const res = await this.ds
        .createQueryBuilder(EventEntity, 'event')
        .insert()
        .values({
          data: event.data,
          metadata: event.metadata,
          streamId: streamName,
          messageType: event.type,

          messageId: randomUUID(),
          timestamp: new Date(),
          streamPosition: i + latest + 1,
        })
        .execute();
    }

    return { nextExpectedStreamVersion: BigInt(latest + events.length + 1) };
  }
}

import {
  AggregateStreamOptions,
  AggregateStreamResult,
  AppendToStreamOptions,
  AppendToStreamResult,
  Event,
  EventStore as EventStoreEmmett,
  ReadStreamOptions,
} from '@event-driven-io/emmett';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class EventStore implements EventStoreEmmett {
  abstract aggregateStream<State, EventType extends Event>(
    streamName: string,
    options: AggregateStreamOptions<State, EventType, bigint>,
  ): Promise<AggregateStreamResult<State, bigint>>;

  abstract readStream<EventType extends Event>(
    streamName: string,
    options?: ReadStreamOptions<bigint>,
  ): Promise<{ currentStreamVersion: bigint; events: EventType[] }>;

  abstract appendToStream<EventType extends Event>(
    streamName: string,
    events: EventType[],
    options?: AppendToStreamOptions<bigint>,
  ): Promise<AppendToStreamResult<bigint>>;

  abstract readAllEvents<EventType extends Event>(
    module: string,
    options?: ReadStreamOptions<bigint>,
  ): Promise<{ events: EventType[] }>;
}

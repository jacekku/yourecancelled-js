import { UUID } from "crypto";

export class CreateEventDto {
    public userId: string;
    public name: string;
    public datetime: Date;
}

export class EventDto {
    public id: UUID;
    public authorId: string;
    public status: EventStatusDto
    public date: Date;
    public name: string;
    public participants: ParticipantDto[]
}

export class ParticipantDto {
    userId: string;
    status: ParticipantStatusDto
}

export enum ParticipantStatusDto {
    ATTENDING,
    CANCELLED
}

export enum EventStatusDto {
    EMPTY,
    ATTENDING,
    CANCELLED
}
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { RestrictedTo } from '../../auth/RestrictedTo.decorator';
import { User } from '../../auth/User.decorator';
import { ActorId, MeetingId, MeetingResult } from '../Meeting';
import { MeetingReadModel } from '../service/Meetings.readmodel';
import { MeetingsService } from '../service/Meetings.service';
import {
  AddParticipantDto,
  ChangeEventDataDto,
  CreateEventDto,
  EventDto,
} from './Meetings.dto';

@Controller('events')
@RestrictedTo(['User'])
export class MeetingsController {
  constructor(
    private readonly meetingsService: MeetingsService,
    private readonly meetingReadModel: MeetingReadModel,
  ) { }

  @Get()
  @ApiResponse({ status: 200, type: EventDto, isArray: true })
  async getList(@User('id') userId: ActorId): Promise<EventDto[]> {
    return this.meetingReadModel.getListFor(userId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: EventDto })
  async getById(@Param('id') id: MeetingId): Promise<EventDto> {
    return this.meetingReadModel.getById(id);
  }

  @Post()
  @ApiResponse({ status: 200, type: EventDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createEvent(@Body() body: CreateEventDto, @User('id') userId: ActorId): Promise<EventDto> {
    const result = await this.meetingsService.createEvent(body, userId);
    return this.handleResult(result);
  }

  @Post(':id/participants')
  @ApiResponse({ status: 200, type: EventDto })
  @ApiResponse({ status: 400 })
  async addParticipant(
    @Body() body: AddParticipantDto,
    @Param('id') id: MeetingId,
    @User('id') actorId: ActorId,
  ): Promise<EventDto> {
    const result = await this.meetingsService.addParticipant(id, body, actorId);
    return this.handleResult(result);
  }

  @Put(':id')
  @ApiResponse({ status: 200, type: EventDto })
  @ApiResponse({ status: 400 })
  async modifyEvent(
    @Body() body: ChangeEventDataDto,
    @Param('id') id: MeetingId,
    @User('id') actorId: ActorId,
  ) {
    const result = await this.meetingsService.modifyEvent(id, body, actorId);
    return this.handleResult(result);
  }

  private handleResult(result: MeetingResult): EventDto {
    if (result.errors.length) {
      throw new BadRequestException(result.errors);
    }
    return EventDto.from(result.events);
  }
}

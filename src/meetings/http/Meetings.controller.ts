import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MeetingId } from '../Meeting';
import { MeetingsService } from '../service/Meetings.service';
import { CreateEventDto, EventDto } from './Meetings.dto';

@Controller('events')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  async getList(): Promise<EventDto[]> {
    return 'Hello, world!' as any;
  }

  @Get(':id')
  async getById(@Param('id') id: MeetingId): Promise<EventDto> {
    return this.meetingsService.getById(id);
  }

  @Post()
  async createEvent(@Body() body: CreateEventDto): Promise<EventDto> {
    const result = await this.meetingsService.createEvent(body);
    return EventDto.from(result.events);
  }
}

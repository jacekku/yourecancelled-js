import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  async getById(@Param('id') id: string): Promise<EventDto> {
    return ('getById' + id) as any;
  }

  @Post()
  async createEvent(@Body() body: CreateEventDto): Promise<EventDto> {
    return this.meetingsService.createEvent(body) as any;
  }
}

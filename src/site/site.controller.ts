import { BadRequestException, Body, Controller, Get, Param, Post, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import * as Mustache from 'mustache'
import { MeetingId } from "../meetings/Meeting";
import { MeetingReadModel } from "../meetings/service/Meetings.readmodel";
import { MeetingsService } from "../meetings/service/Meetings.service";
import { EventDto } from "src/meetings/http/Meetings.dto";

@Controller("/site")
export class SiteController {

    constructor(private readonly readModel: MeetingReadModel, private readonly writeModel: MeetingsService) { }

    private EVENT_LINE = '<li>{{date}} | {{name}} | {{status}} | {{id}} | <button hx-get="site/events/{{id}}/edit" hx-target="closest li">Edit</button></li>'

    @Get()
    testGet(@Res({ passthrough: true }) res: Response) {
        res.cookie('userId', "1")
        return "<div><h1>yippiee</h1><title>New Title</title></div>"
    }

    @Get('events')
    async getEvents(@Req() req: Request) {
        const userId = req.cookies['userId'];
        const result = await this.readModel.getListFor(userId);
        return Mustache.render(`{{#.}}${this.EVENT_LINE}{{/.}}`, result).trim()
    }

    @Post("/login")
    login(@Res({ passthrough: true }) res: Response, @Body() body: { username: string }) {
        if (body.username) { res.cookie('userId', body.username); return `<p>User: ${body.username}</p>` }
        else {
            res.status(400)
        }
    }

    @Get('/events/:id/edit')
    async eventEdit(@Req() { cookies }: Request, @Param("id") id: MeetingId) {
        const event = await this.readModel.getById(id);
        return Mustache.render(`<form hx-put="site/events/${id}/edit" style="display: flex;">
            <li>
            <input type="datetime-local" value="{{date}}" name="datetime"></input>|
            <input type="text" value="{{name}}" name="name"></input> |
{{status}} | {{id}}</li>
<button type="submit">Submit</button>
</form>
            `, event).trim();
    }

    @Put("/events/:id/edit")
    async eventEditPut(@Req() { cookies }: Request, @Param("id") id: MeetingId, @Body() body: any) {
        const result = await this.writeModel.modifyEvent(id, body, cookies['userId'])
        if (result.errors.length) throw new BadRequestException(result.errors)
        const event = EventDto.from(result.events);
        return Mustache.render(`${this.EVENT_LINE}`, event).trim();

    }
}
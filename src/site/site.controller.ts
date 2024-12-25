import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import * as Mustache from 'mustache'
import { ActorId, MeetingId } from "../meetings/Meeting";
import { MeetingReadModel } from "../meetings/service/Meetings.readmodel";
import { MeetingsService } from "../meetings/service/Meetings.service";
import { AddParticipantDto, EventDto } from "../meetings/http/Meetings.dto";

@Controller("/site")
export class SiteController {

    constructor(private readonly readModel: MeetingReadModel, private readonly writeModel: MeetingsService) { }

    private EVENT_LINE = `<li>{{date}} | {{name}} | {{status}} |{{#participants}} {{userId}} {{/participants}} | {{id}} |
     <button hx-get="site/events/{{id}}/edit" hx-target="closest li">Edit</button>
     <button hx-get="site/events/{{id}}/participants/edit" hx-target="closest li">Edit Participants</button>
     </li>`;

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

    @Post('/events/:id/participants')
    async eventAddParticipant(@Req() { cookies }: Request, @Param("id") id: MeetingId, @Body() body: AddParticipantDto) {
        const result = await this.writeModel.addParticipant(id, body, cookies['userId'])
        if (result.errors.length) throw new BadRequestException(result.errors)

        const event = EventDto.from(result.events);
        return Mustache.render(`${this.EVENT_LINE}`, event).trim();
    }

    @Delete('/events/:id/participants/:pid')
    async eventRemoveParticipant(@Req() { cookies }: Request, @Param("id") id: MeetingId, @Param("pid") participantId: ActorId) {
        const result = await this.writeModel.removeParticipant(id, participantId, cookies['userId'])
        if (result.errors.length) throw new BadRequestException(result.errors)

        const event = EventDto.from(result.events);
        return Mustache.render(`${this.EVENT_LINE}`, event).trim();
    }

    @Get('/events/:id')
    async getEvent(@Param('id') id: MeetingId) {
        const event = await this.readModel.getById(id);
        return Mustache.render(`${this.EVENT_LINE}`, event).trim();
    }

    @Get('/events/:id/participants/edit')
    async getParticipantEdit(@Param('id') id: MeetingId) {
        const event = await this.readModel.getById(id);
        return Mustache.render(`<form hx-post="site/events/{{id}}/participants">
        {{#participants}} {{userId}} <button hx-delete="site/events/{{id}}/participants/{{userId}}" hx-target="closest form">Remove</button> {{/participants}}
        <input type="text" name="userId">
        <button type="submit">Add Participant</button>
        <button hx-get="site/events/{{id}}" hx-target="closest form">Cancel</button>
        </form>`, event).trim();
    }

}
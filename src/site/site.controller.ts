import { Body, Controller, Get, Header, Post, Req, Res, StreamableFile } from "@nestjs/common";
import { Request, Response } from "express";
import { MeetingReadModel } from "src/meetings/service/Meetings.readmodel";

@Controller("/site")
export class SiteController {

    constructor(private readonly readModel: MeetingReadModel) { }

    @Get()
    testGet(@Res({ passthrough: true }) res: Response) {
        res.cookie('userId', "1")
        return "<div><h1>yippiee</h1><title>New Title</title></div>"
    }

    @Get('events')
    async getEvents(@Req() req: Request) {
        const userId = req.cookies['userId'];
        const result = await this.readModel.getListFor(userId);
        let items = '';
        result.forEach(event => {
            items += `<li>${event.date} | ${event.name} | ${event.status} | ${event.id}</li>`
        })
        return items
    }

    @Post("/login")
    login(@Res({ passthrough: true }) res: Response, @Body() body: { username: string }) {
        if (body.username) { res.cookie('userId', body.username); return `<p>User: ${body.username}</p>` }
        else {
            res.status(400)
        }
    }
}
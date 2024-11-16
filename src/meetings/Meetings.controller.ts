import { Controller, Get } from "@nestjs/common";

@Controller("meetings")
export class MeetingsController {

    @Get("")
    async get() {
        return "Hello, world!"
    }
}
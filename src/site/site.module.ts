import { Module } from "@nestjs/common";
import { SiteController } from "./site.controller";
import { MeetingsModule } from "src/meetings/Meetings.module";

@Module({
    imports: [MeetingsModule],
    controllers: [SiteController]
})
export class SiteModule {

}
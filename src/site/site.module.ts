import { Module } from "@nestjs/common";
import { SiteController } from "./site.controller";
import { MeetingsModule } from "../meetings/Meetings.module";
import { AuthModule } from "src/auth/Auth.module";
import { UsersModule } from "src/users/Users.module";

@Module({
    imports: [MeetingsModule, UsersModule, AuthModule],
    controllers: [SiteController]
})
export class SiteModule { }
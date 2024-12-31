import { Controller, Get, Injectable } from "@nestjs/common";
import { RestrictedTo } from "./RestrictedTo.decorator";
import { User } from "./User.decorator";
import { AuthUser } from "./Auth.model";

@Injectable()
@RestrictedTo(['User'])
@Controller('/auth')
export class AuthController {

    @Get('whoami')
    getMyId(@User() user: AuthUser) {
        return user;
    }
}
import { INestApplication } from "@nestjs/common";
import { ActorId } from "src/meetings/Meeting";
import * as request from 'supertest';

export class AuthClient {
    constructor(private readonly app: INestApplication) { }

    public whoami(userId: ActorId) {
        return request(this.app.getHttpServer())
            .get(`/auth/whoami?userId=${userId}`);
    }
}
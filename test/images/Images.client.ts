import { INestApplication } from "@nestjs/common";
import { join } from "path";
import * as request from 'supertest';

export class ImagesClient {


    constructor(private readonly app: INestApplication) { }

    public uploadImage(userId: string) {
        return request(this.app.getHttpServer()).post(`/images?userId=${userId}`).attach('file', join(__dirname, './test_image.png'));
    }

    public getImage(url: any, userId: string) {
        return request(this.app.getHttpServer()).get(`/images/${url}?userId=${userId}`)
    }

    public grantAccess(url: string, owner: string, grantee: string) {
        return request(this.app.getHttpServer()).put(`/images/${url}/access/${grantee}?userId=${owner}`);
    }
}
import { AuthUser } from "../Auth.model";
import { SSOClient } from "../SSOClient.interface";

export class FirebaseSSOClient implements SSOClient {
    async authenticate(token: string): Promise<AuthUser> {
        return { id: '2' };
    }
}
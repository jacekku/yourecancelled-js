import { AuthUser } from "./Auth.model";

export abstract class SSOClient {
    abstract authenticate(token: string): Promise<AuthUser>;
}
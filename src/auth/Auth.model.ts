export class AuthUser {
  id: AuthUserId;
  externalId: AuthExternalId;
}

export type AuthUserId = Flavour<string, 'authUserId'>;
export type AuthExternalId = Flavour<string, 'authExternalId'>;

type Flavour<K, T> = K & {
  readonly __brand?: T;
};

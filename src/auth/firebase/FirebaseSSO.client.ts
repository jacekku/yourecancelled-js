import { Logger, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { AuthUser } from '../Auth.model';
import { SSOClient } from '../SSOClient.interface';

type FirebasePublicKeyResponse = {
  [key: string]: string;
};

export class FirebaseSSOClient implements SSOClient {
  private static readonly MINUTES = 1000 * 60;
  private readonly logger: Logger = new Logger(FirebaseSSOClient.name);
  private keys: FirebasePublicKeyResponse = {};
  private lastRefreshed: number = 0;

  constructor() {
    this.refreshKeys();
  }

  private async refreshKeys() {
    if (Date.now() - this.lastRefreshed < FirebaseSSOClient.MINUTES * 10) {
      this.logger.log('Tried refreshing too soon');
      return;
    }
    const res = await axios.get(
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
    );
    if (res.status == 200) {
      this.logger.log(
        'Refreshing public keys: ' + Object.keys(res.data).length,
      );
      this.keys = res.data;
      this.lastRefreshed = Date.now();
    }
  }

  async authenticate(token: string): Promise<AuthUser> {
    let decoded: FirebaseUser;

    Object.values(this.keys).forEach(async (key, index, { length }) => {
      try {
        if (decoded) return;
        decoded = jwt.verify(token, key, {
          issuer: 'https://securetoken.google.com/you-re-cancelled-1029f',
          audience: 'you-re-cancelled-1029f',
        }) as FirebaseUser;
      } catch (e) {
        this.logger.warn(`Key ${index + 1}/${length} Failed with error ` + e);
        if (e.toString().includes('invalid signature')) {
          this.refreshKeys();
        }
      }
    });
    if (!decoded) throw new UnauthorizedException();

    return this.toAuthUser(decoded);
  }

  private toAuthUser(user: FirebaseUser): AuthUser {
    return {
      externalId: user.user_id,
      id: user.user_id,
    };
  }
}

class FirebaseUser {
  public iss: string;
  public aud: string;
  public auth_time: number;
  public user_id: string;
  public sub: string;
  public iat: number;
  public exp: number;
  public email: string;
  public email_verified: boolean;
}

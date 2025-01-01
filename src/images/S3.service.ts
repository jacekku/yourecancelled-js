import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  constructor(
    private configService: ConfigService,
    private readonly s3Client: S3Client,
  ) {}

  async uploadFile(file: Buffer, key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: key,
      Body: file,
    });

    await this.s3Client.send(command);
    return key; // Return the S3 object key
  }

  async getFileUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 60 }); // URL expires in 60 seconds
  }
}

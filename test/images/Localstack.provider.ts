import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { LocalstackContainer } from '@testcontainers/localstack';

export async function createLocalstackWithS3() {
  const localstack = await new LocalstackContainer().start();
  const awsConfig = {
    endpoint: localstack.getConnectionUri(),
    credentials: {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    },
    region: 'eu-central-1',
    forcePathStyle: true,
  };
  const s3 = new S3Client(awsConfig);
  try {
    const command = new CreateBucketCommand({
      Bucket: process.env.AWS_S3_BUCKET,
    });
    await s3.send(command);
  } catch (error) {
    console.error('Error creating bucket:', error);
  }
  return { localstack, s3 };
}

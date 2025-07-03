// src/aws-upload/aws.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';

@Injectable()
export class AwsService {
  private readonly s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  async uploadToS3(filePath: string, fileName: string): Promise<string> {
    const fileStream = fs.createReadStream(filePath);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `recordings/${fileName}`,
      Body: fileStream,
      ContentType: 'video/mp4',
    });

    await this.s3.send(command);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/recordings/${fileName}`;
  }
}

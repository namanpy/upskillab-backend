// // src/aws-upload/aws.service.ts
// import { Injectable } from '@nestjs/common';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import * as fs from 'fs';

// @Injectable()
// export class AwsService {
//   private readonly s3 = new S3Client({
//     region: process.env.AWS_REGION!,
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//     },
//   });

//   async uploadToS3(filePath: string, fileName: string): Promise<string> {
//     const fileStream = fs.createReadStream(filePath);

//     const command = new PutObjectCommand({
//       Bucket: process.env.AWS_BUCKET_NAME!,
//       Key: `recordings/${fileName}`,
//       Body: fileStream,
//       ContentType: 'video/mp4',
//     });

//     await this.s3.send(command);

//     return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/recordings/${fileName}`;
//   }
// }

import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, ObjectCannedACL, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';
import * as path from 'path';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { getGoogleAuth } from 'src/common/google-auth';
@Injectable()
export class AwsService {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION as string, // force string
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET || '';
  }

async uploadDriveFileToS3(fileId: string, fileName?: string): Promise<string> {
  const auth = getGoogleAuth(); // your service account auth
  const token = await auth.getAccessToken();

  // 1️⃣ Download video from Google Drive using auth
  const response = await axios.get(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: { Authorization: `Bearer ${token.token}` },
      responseType: 'arraybuffer',
    },
  );

  // 2️⃣ Prepare file name
  const finalName = fileName || `${fileId}.mp4`;

  // 3️⃣ Upload to S3
  const uploadParams = {
    Bucket: this.bucket,
    Key: `videos/${finalName}`,
    Body: response.data,
    ContentType: 'video/mp4',
  };

  await this.s3.send(new PutObjectCommand(uploadParams));

  return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
}


    async listAllVideos(prefix) {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix && prefix.trim() !== '' ? `${prefix}/` : undefined,
    });

    const response = await this.s3.send(command);

    if (!response.Contents) return [];

    return response.Contents.map((item) => ({
      key: item.Key,
      url: `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
      size: item.Size,
      lastModified: item.LastModified,
    }));
  }
  async deleteFile(key: string) {
    if (!key) {
      throw new BadRequestException('File key is required for deletion.');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3.send(command);

    return { message: `File '${key}' deleted successfully.` };
  }
}

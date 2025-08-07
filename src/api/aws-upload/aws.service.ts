import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';
import { google } from 'googleapis';
import { getGoogleAuth } from 'src/common/google-auth';
import * as path from 'path';

@Injectable()
export class AwsService {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET || '';
  }

  /**
   * Uploads a Google Drive file to AWS S3 using streaming + multipart upload
   */
  async uploadDriveFileToS3(fileId: string, fileName?: string): Promise<string> {
    const auth = getGoogleAuth(); // your service account
    const token = await auth.getAccessToken();

    // 1️⃣ Download video from Google Drive as stream
    const response = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: { Authorization: `Bearer ${token.token}` },
        responseType: 'stream', // STREAMING, not arraybuffer
      },
    );

    // 2️⃣ Prepare file name
    const finalName = fileName || `${fileId}.mp4`;

    // 3️⃣ Use AWS Multipart Upload via @aws-sdk/lib-storage
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucket,
        Key: `videos/${finalName}`,
        Body: response.data, // This is a readable stream
        ContentType: 'video/mp4',
      },
      leavePartsOnError: false, // auto cleanup on failure
    });

    // Optional: monitor progress
    upload.on('httpUploadProgress', (progress) => {
      console.log(`Uploading ${finalName}:`, progress.loaded, '/', progress.total || 'unknown');
    });

    await upload.done();

    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/videos/${finalName}`;
  }

  /**
   * List all uploaded videos
   */
  async listAllVideos(prefix?: string) {
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

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string) {
    if (!key) throw new BadRequestException('File key is required for deletion.');

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3.send(command);

    return { message: `File '${key}' deleted successfully.` };
  }
}

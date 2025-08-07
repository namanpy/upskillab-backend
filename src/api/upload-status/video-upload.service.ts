import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { HttpService } from '@nestjs/axios';
import { getGoogleAuth } from 'src/common/google-auth';
import { PassThrough } from 'stream';

@Injectable()
export class UploadService {
  private s3: S3;
  private progressMap = new Map<string, number>();
  private urlMap = new Map<string, string>(); // ✅ Store final S3 URL per uploadId

  constructor(private readonly httpService: HttpService) {
    this.s3 = new S3({
      region: process.env.AWS_REGION || 'ap-south-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    });
  }

  /**
   * Starts uploading a Google Drive video to S3 in background
   */
  async uploadFromDriveToS3(fileId: string,fileName:string): Promise<string> {
    const uploadId = uuidv4();

    // Fire-and-forget background upload
    this.backgroundUpload(fileId, uploadId, fileName);

    return uploadId;
  }

  /**
   * Get percentage progress (0-100) or -1 if failed
   */
  getProgress(uploadId: string): number {
    return this.progressMap.get(uploadId) ?? 0;
  }

  /**
   * Get uploaded S3 URL for this uploadId (if done)
   */
  getS3Url(uploadId: string): string | null {
    return this.urlMap.get(uploadId) ?? null;
  }

  /**
   * Actual background upload logic
   */
  private async backgroundUpload(fileId: string, uploadId: string,fileName:string) {
    const auth = getGoogleAuth();
    const token = await auth.getAccessToken();

    try {
      const fileRes = await this.httpService.axiosRef({
        method: 'GET',
        url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        responseType: 'stream',
        headers: { Authorization: `Bearer ${token.token}` },
      });

      const totalSize = Number(fileRes.headers['content-length'] || 0);
      let uploadedBytes = 0;

      const passThrough = new PassThrough();

      fileRes.data.on('data', (chunk: Buffer) => {
        uploadedBytes += chunk.length;
        const percent = totalSize
          ? Math.floor((uploadedBytes / totalSize) * 100)
          : 0;
        this.progressMap.set(uploadId, percent);
      });

      // Pipe Drive stream to S3
      fileRes.data.pipe(passThrough);

      const s3Key = `uploads/${fileName}.mp4`;

      const uploadResult = await this.s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET || '',
          Key: s3Key,
          Body: passThrough,
          ContentType: 'video/mp4',
        })
        .promise();

      this.progressMap.set(uploadId, 100);
      this.urlMap.set(uploadId, uploadResult.Location); // ✅ Save final URL
      console.log(`✅ Upload complete: ${uploadResult.Location}`);
    } catch (err) {
      console.error('❌ Upload failed:', err);
      this.progressMap.set(uploadId, -1);
    }
  }
}

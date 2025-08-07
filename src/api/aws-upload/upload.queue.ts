import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { S3 } from 'aws-sdk';
import axios from 'axios';

@Processor('upload')
export class UploadProcessor {
  @Process('google-to-s3')
  async handleUpload(job: Job) {
    const { googleDriveUrl, s3Key } = job.data;

    const s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const response = await axios.get(googleDriveUrl, {
      responseType: 'stream',
    });

    const contentLength = response.headers['content-length'];

    let uploaded = 0;

    response.data.on('data', chunk => {
      uploaded += chunk.length;
      const progress = Math.floor((uploaded / contentLength) * 100);
      job.progress(progress); // <-- Send progress
    });

    await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET || '',
      Key: s3Key,
      Body: response.data,
      ContentType: 'video/mp4', // or detect dynamically
    }).promise();

    return { status: 'done', s3Key };
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideoUploaderService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async uploadVideo(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimeTypes = [
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/mkv',
      'video/webm',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.originalname} (${file.mimetype}) not allowed. Only video files are supported.`,
      );
    }

    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    if (!bucketName) {
      throw new BadRequestException('S3 bucket name not configured');
    }

    const fileId = Date.now().toString() + Math.random().toString(36).substring(2, 15);
    const key = `${folder}/${fileId}-${file.originalname}`;

    const params: S3.Types.PutObjectRequest = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const data = await this.s3.upload(params).promise();
      return (
        data.Location ||
        `https://${bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`
      );
    } catch (error) {
      throw new BadRequestException(
        `Failed to upload video ${file.originalname}: ${error.message}`,
      );
    }
  }
} 
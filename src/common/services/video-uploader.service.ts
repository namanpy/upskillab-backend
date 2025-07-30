import { Injectable, BadRequestException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

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
      fs.unlinkSync(file.path); // Clean up
      throw new BadRequestException(
        `File type ${file.originalname} (${file.mimetype}) not allowed. Only video files are supported.`,
      );
    }

    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    if (!bucketName) {
      fs.unlinkSync(file.path); // Clean up
      throw new BadRequestException('S3 bucket name not configured');
    }

    const fileId = Date.now().toString() + Math.random().toString(36).substring(2, 15);
    const key = `${folder}/${fileId}-${file.originalname}`;

    const filePath = path.resolve(file.path);
    const fileStream = fs.createReadStream(filePath);

    const params: S3.Types.PutObjectRequest = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    try {
      const data = await this.s3.upload(params).promise();
      fs.unlinkSync(filePath); // Clean up temp file
      return (
        data.Location ||
        `https://${bucketName}.s3.${this.configService.get<string>(
          'AWS_REGION',
        )}.amazonaws.com/${key}`
      );
    } catch (error) {
      fs.unlinkSync(filePath); // Clean up temp file
      throw new BadRequestException(
        `Failed to upload video ${file.originalname}: ${error.message}`,
      );
    }
  }
}

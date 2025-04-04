import { Injectable, BadRequestException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploaderService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  private async uploadSingleFile(file: Express.Multer.File, folder: string, fileId: string): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    if (!bucketName) {
      throw new BadRequestException('S3 bucket name not configured');
    }

    const key = `${folder}/${fileId}-${file.originalname}`;

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    //   ACL: 'public-read',
    };

    try {
      const data = await this.s3.upload(params).promise();
      return data.Location || `https://${bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
    } catch (error) {
      throw new BadRequestException(`Failed to upload file ${file.originalname}: ${error.message}`);
    }
  }

  async uploadFiles(files: Express.Multer.File[], folder: string): Promise<{ filename: string; fileId: string; fileUrl: string }[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new BadRequestException(`File type ${file.originalname} (${file.mimetype}) not allowed. Only JPEG, PNG, GIF, and PDF are supported.`);
        }

        const fileId = Date.now().toString() + Math.random().toString(36).substring(2, 15);
        const fileUrl = await this.uploadSingleFile(file, folder, fileId);

        return {
          filename: file.originalname,
          fileId,
          fileUrl,
        };
      }),
    );

    return uploadResults;
  }
}
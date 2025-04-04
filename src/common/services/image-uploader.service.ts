import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageUploaderService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    // Validate all required environment variables
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const region = this.configService.get<string>('AWS_REGION');
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');

    if (!accessKeyId) {
      throw new BadRequestException('AWS_ACCESS_KEY_ID environment variable is not set');
    }
    if (!secretAccessKey) {
      throw new BadRequestException('AWS_SECRET_ACCESS_KEY environment variable is not set');
    }
    if (!region) {
      throw new BadRequestException('AWS_REGION environment variable is not set');
    }
    if (!bucket) {
      throw new BadRequestException('AWS_S3_BUCKET environment variable is not set');
    }

    // Initialize S3Client with credentials
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
    });

    this.bucket = bucket;
  }

  async uploadImage(file: Express.Multer.File, entityType: string, entityId: string): Promise<string> {
    const key = `${entityType}/${entityId}/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read', // Ensure the file is publicly accessible
    });

    await this.s3Client.send(command);

    // Construct the public URL
    const imageUrl = `https://${this.bucket}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
    return imageUrl;
  }
}
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
} from '@nestjs/common';
import { UploadService } from './video-upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('google-drive-to-s3')
  async uploadFromDrive(@Body() body: { fileId: string,fileName:string }) {
    const uploadId = await this.uploadService.uploadFromDriveToS3(body.fileId,body.fileName);
    return { uploadId };
  }

@Get('status/:uploadId')
getStatus(@Param('uploadId') uploadId: string) {
  const progress = this.uploadService.getProgress(uploadId);
  const url = this.uploadService.getS3Url(uploadId);

  return {
    uploadId,
    progress,
    url,
  };
}
}

import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoUploaderService } from '../../common/services/video-uploader.service';
import { memoryStorage } from 'multer';

@Controller('video')
export class VideoController {
  constructor(private readonly videoUploaderService: VideoUploaderService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 1024 * 1024 * 1024 * 10 },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.videoUploaderService.uploadFileToS3(file);
  }
}

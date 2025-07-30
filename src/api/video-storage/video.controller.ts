import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RolesGuard } from '../../common/guard/roles.guard';
import { VideoUploaderService } from '../../common/services/video-uploader.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoUploaderService: VideoUploaderService) {}

  @Post('upload')
  // @Roles('ADMIN') // Optional: enable if role check is required
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Temp local file storage
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024 * 1024, // 10GB limit
      },
    }),
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    const url = await this.videoUploaderService.uploadVideo(file, 'videos');
    return { url };
  }
}

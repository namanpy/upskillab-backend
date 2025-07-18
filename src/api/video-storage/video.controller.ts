import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guard/roles.guard';
import { VideoUploaderService } from '../../common/services/video-uploader.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoUploaderService: VideoUploaderService) {}

  @Post('upload')
//   @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    // Folder can be 'videos' or as per your convention
    const url = await this.videoUploaderService.uploadVideo(file, 'videos');
    return { url };
  }
}

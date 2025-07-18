import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideoController } from './video.controller';
import { VideoUploaderService } from '../../common/services/video-uploader.service';

@Module({
  imports: [ConfigModule],
  controllers: [VideoController],
  providers: [VideoUploaderService],
  exports: [VideoUploaderService],
})
export class VideoModule {} 
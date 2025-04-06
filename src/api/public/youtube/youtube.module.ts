import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { YoutubeController } from './youtube.controller';
import { YoutubeLogicService } from './youtube.logic';
import { YoutubeDataService } from './youtube.data';
import { YoutubeVideo, YoutubeVideoSchema } from '../../../schemas/home/youtube-video.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: YoutubeVideo.name, schema: YoutubeVideoSchema }])],
  controllers: [YoutubeController],
  providers: [YoutubeLogicService, YoutubeDataService],
})
export class YoutubeModule {}
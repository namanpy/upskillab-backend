import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordedVideoSchema } from '../../schemas/recorded-video.schema';
import { RecordedVideoController } from './recorded-video.controller';
import { RecordedVideoLogicService } from './recorded-video.logic';
import { RecordedVideoDataService } from './recorded-video.data';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'RecordedVideo', schema: RecordedVideoSchema }]),
  ],
  controllers: [RecordedVideoController],
  providers: [RecordedVideoLogicService, RecordedVideoDataService],
  exports: [RecordedVideoLogicService], // Export if needed by other modules
})
export class RecordedVideoModule {}
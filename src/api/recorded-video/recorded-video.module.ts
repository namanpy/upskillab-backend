import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordedVideoSchema } from '../../schemas/recorded-video.schema';
import { RecordedVideoController } from './recorded-video.controller';
import { RecordedVideoLogicService } from './recorded-video.logic';
import { RecordedVideoDataService } from './recorded-video.data';
import { EnrollmentModule } from '../enrollment/enrollment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'RecordedVideo', schema: RecordedVideoSchema }]),
    EnrollmentModule,
  ],
  controllers: [RecordedVideoController],
  providers: [RecordedVideoLogicService, RecordedVideoDataService],
  exports: [RecordedVideoLogicService],
})
export class RecordedVideoModule {}
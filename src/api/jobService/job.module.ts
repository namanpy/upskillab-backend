import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config'; // Add ConfigModule import
import { Job, JobSchema } from '../../schemas/job.schema';
import { JobController } from './job.controller';
import { JobLogicService } from './job.logic';
import { JobDataService } from './job.data';
import { ImageUploaderService } from '../../common/services/image-uploader.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Add ConfigModule to imports
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
  ],
  controllers: [JobController],
  providers: [JobLogicService, JobDataService, ImageUploaderService],
  exports: [JobDataService]
})
export class JobModule {}
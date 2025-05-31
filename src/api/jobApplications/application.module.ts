import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Application, ApplicationSchema } from '../../schemas/application.schema';
import { ApplicationController } from './application.controller';
import { ApplicationLogicService } from './application.logic';
import { ApplicationDataService } from './application.data';
import { JobDataService } from '../jobService/job.data';
import { Job, JobSchema } from '../../schemas/job.schema';
import { FileUploaderService } from '../../common/services/file-uploader.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Job.name, schema: JobSchema },
    ]),
    NotificationModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationLogicService, ApplicationDataService, JobDataService, FileUploaderService],
})
export class ApplicationModule {}
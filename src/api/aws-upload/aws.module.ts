import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
// import { AwsController } from './aws.controller';
import { VideoController } from './aws.controller';
import { UploadProcessor } from './upload.queue';
import { BullModule } from '@nestjs/bull';
@Module({
     imports: [
    BullModule.registerQueue({
      name: 'upload',
    }),
  ],
  controllers: [VideoController],
  providers: [AwsService,UploadProcessor],
  exports: [AwsService,UploadProcessor],
})
export class AwsModule {}

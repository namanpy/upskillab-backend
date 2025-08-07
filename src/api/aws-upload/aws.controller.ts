import { Controller, Post, Body, Get, Query, Delete, Param, NotFoundException } from '@nestjs/common';
import { AwsService } from './aws.service';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('video')
export class VideoController {
  constructor(@InjectQueue('upload') private uploadQueue: Queue) {}

  @Post('upload')
  async startUpload(@Body() body: { googleDriveUrl: string, s3Key: string }) {
    const job = await this.uploadQueue.add('google-to-s3', {
      googleDriveUrl: body.googleDriveUrl,
      s3Key: body.s3Key,
    });

    return { jobId: job.id };
  }

  @Get('progress/:id')
  async getProgress(@Param('id') id: string) {
    const job = await this.uploadQueue.getJob(id);
    
if (!job) {
  throw new NotFoundException('Job not found');
}
    const progress = await job.progress();
    const state = await job.getState();

    return { progress, state };
  }
}



// @Controller('aws')
// export class AwsController {
//   constructor(private readonly awsService: AwsService) {}

//   @Post('upload-from-drive')
//   async uploadFromDrive(@Body() body: { fileUrl: string; fileName?: string }) {
//     if (!body.fileUrl) {
//       throw new Error('fileUrl is required');
//     }

//     const awsUrl = await this.awsService.uploadDriveFileToS3(
//       body.fileUrl,
//       body.fileName,
//     );

//     return { awsUrl };
//   }

//   @Get('videos')
//   async getAllVideos(@Query('folder') folder?: string) {
//     return await this.awsService.listAllVideos(folder);
//   }

//   @Delete()
//   async deleteVideo(@Query('key') key: string) {
//     return this.awsService.deleteFile(key);
//   }
  
// }

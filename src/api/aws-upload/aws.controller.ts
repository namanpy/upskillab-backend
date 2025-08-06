import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { AwsService } from './aws.service';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post('upload-from-drive')
  async uploadFromDrive(@Body() body: { fileUrl: string; fileName?: string }) {
    if (!body.fileUrl) {
      throw new Error('fileUrl is required');
    }

    const awsUrl = await this.awsService.uploadDriveFileToS3(
      body.fileUrl,
      body.fileName,
    );

    return { awsUrl };
  }

  @Get('videos')
  async getAllVideos(@Query('folder') folder?: string) {
    return await this.awsService.listAllVideos(folder);
  }

  @Delete()
  async deleteVideo(@Query('key') key: string) {
    return this.awsService.deleteFile(key);
  }
  
}

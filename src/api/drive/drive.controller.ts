import { Controller, Get, Query } from '@nestjs/common';
import { DriveService } from './drive.service';

@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @Get('videos')
  async getVideos(@Query('folderId') folderId: string) {
    if (!folderId) {
      throw new Error('folderId is required');
    }

    const videos = await this.driveService.listVideos(folderId);
    return {
      count: videos.length,
      videos: videos.map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        viewUrl: file.webViewLink,
        downloadUrl: file.webContentLink,
        createdTime: file.createdTime,
      })),
    };
  }
}

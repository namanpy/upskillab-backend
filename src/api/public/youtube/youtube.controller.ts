import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { YoutubeLogicService } from './youtube.logic';
import { CreateYoutubeVideoDto, GetYoutubeVideosResponseDTO, UpdateYoutubeVideoDto } from '../../../dto/home/youtube-video.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('youtube-videos')
@Controller('youtube-videos')
export class YoutubeController {
  constructor(private youtubeLogicService: YoutubeLogicService) {}

  @ApiResponse({ status: 201, description: 'Create a new YouTube video entry' })
  @Post()
  async createVideo(@Body() createVideoDto: CreateYoutubeVideoDto) {
    return await this.youtubeLogicService.createVideo(createVideoDto);
  }

  @ApiResponse({ status: 200, description: 'Get all active YouTube videos', type: GetYoutubeVideosResponseDTO })
  @Get()
  async getVideos(@Query('all') all?: string) {
    const activeOnly = all !== 'true';
    return await this.youtubeLogicService.getVideos(activeOnly);
  }

  @ApiResponse({ status: 200, description: 'Get a single YouTube video by ID' })
  @Get(':id')
  async getVideoById(@Param('id') id: string) {
    return await this.youtubeLogicService.getVideoById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a YouTube video by ID' })
  @Put(':id')
  async updateVideo(@Param('id') id: string, @Body() updateVideoDto: UpdateYoutubeVideoDto) {
    return await this.youtubeLogicService.updateVideo(id, updateVideoDto);
  }

  @ApiResponse({ status: 200, description: 'Delete a YouTube video by ID' })
  @Delete(':id')
  async deleteVideo(@Param('id') id: string) {
    return await this.youtubeLogicService.deleteVideo(id);
  }
}
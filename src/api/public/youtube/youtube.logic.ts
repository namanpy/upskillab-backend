import { Injectable, NotFoundException } from '@nestjs/common';
import { YoutubeDataService } from './youtube.data';
import { CreateYoutubeVideoDto, GetYoutubeVideosResponseDTO, UpdateYoutubeVideoDto, YoutubeVideo } from '../../../dto/home/youtube-video.dto';
import { YoutubeVideoDocument } from '../../../schemas/home/youtube-video.schema';
import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

@Injectable()
export class YoutubeLogicService {
  constructor(private youtubeDataService: YoutubeDataService) {}

  private mapToDto(video: YoutubeVideoDocument): YoutubeVideo {
    const docObject = video.toObject();
    return mapToDto<YoutubeVideo, YoutubeVideoDocument>(video, (doc) => ({
      ...docObject,
      _id: doc._id.toHexString(),
    }));
  }

  private mapToDtoArray(videos: YoutubeVideoDocument[]): YoutubeVideo[] {
    return mapToDtoArray<YoutubeVideo, YoutubeVideoDocument>(videos, (doc) => ({
      ...doc.toObject(),
      _id: doc._id.toHexString(),
    }));
  }

  async createVideo(createVideoDto: CreateYoutubeVideoDto) {
    const video = await this.youtubeDataService.createVideo(createVideoDto);
    return { video: this.mapToDto(video) };
  }

  async getVideos(activeOnly: boolean = true): Promise<GetYoutubeVideosResponseDTO> {
    const videos = await this.youtubeDataService.getVideos(activeOnly);
    return { videos: this.mapToDtoArray(videos) };
  }

  async getVideoById(id: string): Promise<{ video: YoutubeVideo }> {
    const video = await this.youtubeDataService.getVideoById(id);
    if (!video) throw new NotFoundException(`Video with ID ${id} not found`);
    return { video: this.mapToDto(video) };
  }

  async updateVideo(id: string, updateVideoDto: UpdateYoutubeVideoDto) {
    const video = await this.youtubeDataService.updateVideo(id, updateVideoDto);
    if (!video) throw new NotFoundException(`Video with ID ${id} not found`);
    return { video: this.mapToDto(video) };
  }

  async deleteVideo(id: string) {
    const video = await this.youtubeDataService.deleteVideo(id);
    if (!video) throw new NotFoundException(`Video with ID ${id} not found`);
    return { message: 'Video deleted successfully' };
  }
}
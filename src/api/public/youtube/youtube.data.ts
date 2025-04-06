import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { YoutubeVideo, YoutubeVideoDocument } from '../../../schemas/home/youtube-video.schema';
import { CreateYoutubeVideoDto, UpdateYoutubeVideoDto } from '../../../dto/home/youtube-video.dto';

@Injectable()
export class YoutubeDataService {
  constructor(@InjectModel(YoutubeVideo.name) private youtubeModel: Model<YoutubeVideoDocument>) {}

  async createVideo(createVideoDto: CreateYoutubeVideoDto): Promise<YoutubeVideoDocument> {
    const newVideo = new this.youtubeModel(createVideoDto);
    return newVideo.save();
  }

  async getVideos(activeOnly: boolean = true): Promise<YoutubeVideoDocument[]> {
    return this.youtubeModel.find(activeOnly ? { active: true } : {}).exec();
  }

  async getVideoById(id: string): Promise<YoutubeVideoDocument | null> {
    return this.youtubeModel.findById(id).exec();
  }

  async updateVideo(id: string, updateVideoDto: UpdateYoutubeVideoDto): Promise<YoutubeVideoDocument | null> {
    return this.youtubeModel
      .findByIdAndUpdate(id, updateVideoDto, { new: true, runValidators: true })
      .exec();
  }

  async deleteVideo(id: string): Promise<YoutubeVideoDocument | null> {
    return this.youtubeModel.findByIdAndDelete(id).exec();
  }
}
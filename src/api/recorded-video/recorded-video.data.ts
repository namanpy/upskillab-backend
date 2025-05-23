// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { RecordedVideo, RecordedVideoDocument } from '../../schemas/recorded-video.schema';
// import { CreateRecordedVideoDto, UpdateRecordedVideoDto } from '../../dto/recorded-video.dto';

// @Injectable()
// export class RecordedVideoDataService {
//   constructor(@InjectModel(RecordedVideo.name) private recordedVideoModel: Model<RecordedVideoDocument>) {}

//   async getVideos(): Promise<RecordedVideoDocument[]> {
//     return this.recordedVideoModel.find().populate('chapterId').populate('courseId').populate('uploadedBy').exec();
//   }

//   async getVideoById(id: string): Promise<RecordedVideoDocument | null> {
//     const video = await this.recordedVideoModel
//       .findById(id)
//       .populate('chapterId')
//       .populate('courseId')
//       .populate('uploadedBy')
//       .exec();
//     if (!video) {
//       throw new NotFoundException(`Video with ID ${id} not found`);
//     }
//     return video;
//   }

//   async createVideo(createRecordedVideoDto: CreateRecordedVideoDto, uploadedBy: string): Promise<RecordedVideoDocument> {
//     const newVideo = new this.recordedVideoModel({
//       ...createRecordedVideoDto,
//       uploadedBy,
//     });
//     return newVideo.save();
//   }

//   async updateVideo(id: string, updateRecordedVideoDto: UpdateRecordedVideoDto): Promise<RecordedVideoDocument | null> {
//     return this.recordedVideoModel
//       .findByIdAndUpdate(id, updateRecordedVideoDto, { new: true })
//       .populate('chapterId')
//       .populate('courseId')
//       .populate('uploadedBy')
//       .exec();
//   }

//   async deleteVideo(id: string): Promise<RecordedVideoDocument | null> {
//     return this.recordedVideoModel.findByIdAndDelete(id).exec();
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecordedVideo, RecordedVideoDocument } from '../../schemas/recorded-video.schema';
import { CreateRecordedVideoDto, UpdateRecordedVideoDto } from '../../dto/recorded-video.dto';

@Injectable()
export class RecordedVideoDataService {
  constructor(@InjectModel(RecordedVideo.name) private recordedVideoModel: Model<RecordedVideoDocument>) {}

  async getVideos(): Promise<RecordedVideoDocument[]> {
    return this.recordedVideoModel.find().populate('chapterId').populate('courseId').exec();
  }

  async getVideoById(id: string): Promise<RecordedVideoDocument | null> {
    const video = await this.recordedVideoModel
      .findById(id)
      .populate('chapterId')
      .populate('courseId')
      .exec();
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return video;
  }

  async createVideo(createRecordedVideoDto: CreateRecordedVideoDto): Promise<RecordedVideoDocument> {
    const newVideo = new this.recordedVideoModel(createRecordedVideoDto);
    return newVideo.save();
  }

  async updateVideo(id: string, updateRecordedVideoDto: UpdateRecordedVideoDto): Promise<RecordedVideoDocument | null> {
    return this.recordedVideoModel
      .findByIdAndUpdate(id, updateRecordedVideoDto, { new: true })
      .populate('chapterId')
      .populate('courseId')
      .exec();
  }

  async deleteVideo(id: string): Promise<RecordedVideoDocument | null> {
    return this.recordedVideoModel.findByIdAndDelete(id).exec();
  }
}
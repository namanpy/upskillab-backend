// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Story, StoryDocument } from '../../schemas/stories.schema';
// import { CreateStoryDto } from '../../dto/stories.dto';

// @Injectable()
// export class StoriesDataService {
//   constructor(@InjectModel(Story.name) private storyModel: Model<StoryDocument>) {}

//   async getStories(): Promise<StoryDocument[]> {
//     return this.storyModel.find().exec();
//   }

//   async createStory(createStoryDto: CreateStoryDto & { userImageUrl: string; companyLogoUrl: string }): Promise<StoryDocument> {
//     const newStory = new this.storyModel(createStoryDto);
//     return newStory.save();
//   }

//   async getStoryById(id: string): Promise<StoryDocument | null> {
//     return this.storyModel.findById(id).exec();
//   }

//   async updateStory(id: string, updateStoryDto: Partial<CreateStoryDto & { userImageUrl: string; companyLogoUrl: string }>): Promise<StoryDocument | null> {
//     return this.storyModel.findByIdAndUpdate(id, updateStoryDto, { new: true }).exec();
//   }

//   async deleteStory(id: string): Promise<StoryDocument | null> {
//     return this.storyModel.findByIdAndDelete(id).exec();
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Story, StoryDocument } from '../../schemas/stories.schema';
import { CreateStoryDto } from '../../dto/stories.dto';

@Injectable()
export class StoryDataService {
  constructor(@InjectModel(Story.name) private storyModel: Model<StoryDocument>) {}

  async getStories(): Promise<StoryDocument[]> {
    return this.storyModel.find().exec();
  }

  async createStory(createStoryDto: CreateStoryDto & { userImageUrl: string; companyLogoUrl: string }): Promise<StoryDocument> {
    const newStory = new this.storyModel(createStoryDto);
    return newStory.save();
  }

  async getStoryById(id: string): Promise<StoryDocument | null> {
    return this.storyModel.findById(id).exec();
  }

  async updateStory(id: string, updateStoryDto: Partial<CreateStoryDto & { userImageUrl: string; companyLogoUrl: string }>): Promise<StoryDocument | null> {
    return this.storyModel.findByIdAndUpdate(id, updateStoryDto, { new: true }).exec();
  }

  async deleteStory(id: string): Promise<StoryDocument | null> {
    return this.storyModel.findByIdAndDelete(id).exec();
  }
}
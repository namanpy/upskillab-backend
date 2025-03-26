import { Injectable, NotFoundException } from '@nestjs/common';
import { StoriesDataService } from './stories.data';
import { CreateStoryDto } from '../../dto/stories.dto';
import { GetStoriesResponseDTO } from '../../dto/stories.dto';

@Injectable()
export class StoriesLogicService {
  constructor(private storiesDataService: StoriesDataService) {}

  async getStories(): Promise<GetStoriesResponseDTO> {
    const stories = await this.storiesDataService.getStories();
    return {
      stories: stories.map((story) => ({
        _id: story._id.toString(),
        name: story.name,
        userImageUrl: story.userImageUrl,
        description: story.description,
        companyLogoUrl: story.companyLogoUrl,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
      })),
    };
  }

  async createStory(createStoryDto: CreateStoryDto) {
    const story = await this.storiesDataService.createStory(createStoryDto);
    return {
      story: {
        _id: story._id.toString(),
        name: story.name,
        userImageUrl: story.userImageUrl,
        description: story.description,
        companyLogoUrl: story.companyLogoUrl,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
      },
    };
  }

  async getStoryById(id: string) {
    const story = await this.storiesDataService.getStoryById(id);
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
    return {
      story: {
        _id: story._id.toString(),
        name: story.name,
        userImageUrl: story.userImageUrl,
        description: story.description,
        companyLogoUrl: story.companyLogoUrl,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
      },
    };
  }

  async updateStory(id: string, updateStoryDto: Partial<CreateStoryDto>) {
    const story = await this.storiesDataService.updateStory(id, updateStoryDto);
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
    return {
      story: {
        _id: story._id.toString(),
        name: story.name,
        userImageUrl: story.userImageUrl,
        description: story.description,
        companyLogoUrl: story.companyLogoUrl,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
      },
    };
  }

  async deleteStory(id: string) {
    const story = await this.storiesDataService.deleteStory(id);
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
    return { message: 'Story deleted successfully' };
  }
}
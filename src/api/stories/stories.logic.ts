// import { Injectable, NotFoundException } from '@nestjs/common';
// import { StoriesDataService } from './stories.data';
// import { CreateStoryDto, GetStoriesResponseDTO, Story } from '../../dto/stories.dto';
// import { StoryDocument } from '../../schemas/stories.schema';
// import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';

// @Injectable()
// export class StoriesLogicService {
//   constructor(private storiesDataService: StoriesDataService) {}

//   private mapToDto(story: StoryDocument): Story {
//     return mapToDto<Story, StoryDocument>(story);
//   }

//   private mapToDtoArray(stories: StoryDocument[]): Story[] {
//     return mapToDtoArray<Story, StoryDocument>(stories);
//   }

//   async getStories(): Promise<GetStoriesResponseDTO> {
//     const stories = await this.storiesDataService.getStories();
//     return {
//       stories: this.mapToDtoArray(stories),
//     };
//   }

//   async createStory(createStoryDto: CreateStoryDto & { userImageUrl: string; companyLogoUrl: string }) {
//     const story = await this.storiesDataService.createStory(createStoryDto);
//     return {
//       story: this.mapToDto(story),
//     };
//   }

//   async getStoryById(id: string) {
//     const story = await this.storiesDataService.getStoryById(id);
//     if (!story) {
//       throw new NotFoundException(`Story with ID ${id} not found`);
//     }
//     return {
//       story: this.mapToDto(story),
//     };
//   }

//   async updateStory(id: string, updateStoryDto: Partial<CreateStoryDto & { userImageUrl: string; companyLogoUrl: string }>) {
//     const story = await this.storiesDataService.updateStory(id, updateStoryDto);
//     if (!story) {
//       throw new NotFoundException(`Story with ID ${id} not found`);
//     }
//     return {
//       story: this.mapToDto(story),
//     };
//   }

//   async deleteStory(id: string) {
//     const story = await this.storiesDataService.deleteStory(id);
//     if (!story) {
//       throw new NotFoundException(`Story with ID ${id} not found`);
//     }
//     return { message: 'Story deleted successfully' };
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { StoryDataService } from './stories.data';
import { CreateStoryDto, GetStoriesResponseDTO, Story } from '../../dto/stories.dto';
import { StoryDocument } from '../../schemas/stories.schema';
import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';

@Injectable()
export class StoryLogicService {
  constructor(private storyDataService: StoryDataService) {}

  private mapToDto(story: StoryDocument): Story {
    return mapToDto<Story, StoryDocument>(story);
  }

  private mapToDtoArray(stories: StoryDocument[]): Story[] {
    return mapToDtoArray<Story, StoryDocument>(stories);
  }

  async getStories(): Promise<GetStoriesResponseDTO> {
    const stories = await this.storyDataService.getStories();
    return {
      stories: this.mapToDtoArray(stories),
    };
  }

  async createStory(createStoryDto: CreateStoryDto & { userImageUrl: string; companyLogoUrl: string }) {
    const story = await this.storyDataService.createStory(createStoryDto);
    return {
      story: this.mapToDto(story),
    };
  }

  async getStoryById(id: string) {
    const story = await this.storyDataService.getStoryById(id);
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
    return {
      story: this.mapToDto(story),
    };
  }

  async updateStory(id: string, updateStoryDto: Partial<CreateStoryDto & { userImageUrl: string; companyLogoUrl: string }>) {
    const story = await this.storyDataService.updateStory(id, updateStoryDto);
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
    return {
      story: this.mapToDto(story),
    };
  }

  async deleteStory(id: string) {
    const story = await this.storyDataService.deleteStory(id);
    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }
    return { message: 'Story deleted successfully' };
  }
}
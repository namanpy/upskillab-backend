import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
  } from '@nestjs/common';
import { StoriesLogicService } from './stories.logic';
import { CreateStoryDto } from '../../dto/stories.dto';
import { GetStoriesResponseDTO } from '../../dto/stories.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('stories')
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesLogicService: StoriesLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all stories',
    type: GetStoriesResponseDTO,
  })
  @Get('')
  async getStories(): Promise<GetStoriesResponseDTO> {
    return await this.storiesLogicService.getStories();
  }

  @ApiResponse({
    status: 201,
    description: 'Create a new story',
  })
  @Post('')
  async createStory(@Body() createStoryDto: CreateStoryDto) {
    return await this.storiesLogicService.createStory(createStoryDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Get a single story by ID',
  })
  @Get(':id')
  async getStoryById(@Param('id') id: string) {
    return await this.storiesLogicService.getStoryById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a story by ID',
  })
  @Put(':id')
  async updateStory(
    @Param('id') id: string,
    @Body() updateStoryDto: Partial<CreateStoryDto>,
  ) {
    return await this.storiesLogicService.updateStory(id, updateStoryDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a story by ID',
  })
  @Delete(':id')
  async deleteStory(@Param('id') id: string) {
    return await this.storiesLogicService.deleteStory(id);
  }
}
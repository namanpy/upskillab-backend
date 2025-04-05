import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { StoriesLogicService } from './stories.logic';
import { CreateStoryDto, GetStoriesResponseDTO } from '../../dto/stories.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../common/services/image-uploader.service';

@ApiTags('stories')
@Controller('stories')
export class StoriesController {
  constructor(
    private storiesLogicService: StoriesLogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({ status: 200, description: 'Get all stories', type: GetStoriesResponseDTO })
  @Get('')
  async getStories(): Promise<GetStoriesResponseDTO> {
    return await this.storiesLogicService.getStories();
  }

  @ApiResponse({ status: 201, description: 'Create a new story with image uploads' })
  @Post('')
  @UseInterceptors(FilesInterceptor('images', 2)) // Allow up to 2 files
  async createStory(@Body() createStoryDto: CreateStoryDto, @UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length < 2) {
      throw new BadRequestException('Both user image and company logo are required');
    }

    const [userImage, companyLogo] = files;
    const userImageUrl = await this.imageUploaderService.uploadImage(userImage, 'stories/users', Date.now().toString());
    const companyLogoUrl = await this.imageUploaderService.uploadImage(companyLogo, 'stories/companies', Date.now().toString());

    const storyData = { ...createStoryDto, userImageUrl, companyLogoUrl };

    return await this.storiesLogicService.createStory(storyData);
  }

  @ApiResponse({ status: 200, description: 'Get a single story by ID' })
  @Get(':id')
  async getStoryById(@Param('id') id: string) {
    return await this.storiesLogicService.getStoryById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a story by ID' })
  @Put(':id')
  async updateStory(@Param('id') id: string, @Body() updateStoryDto: Partial<CreateStoryDto>) {
    return await this.storiesLogicService.updateStory(id, updateStoryDto);
  }

  @ApiResponse({ status: 200, description: 'Delete a story by ID' })
  @Delete(':id')
  async deleteStory(@Param('id') id: string) {
    return await this.storiesLogicService.deleteStory(id);
  }
}
import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFiles, UseInterceptors, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { StoriesLogicService } from './stories.logic';
import { CreateStoryDto, GetStoriesResponseDTO } from '../../dto/stories.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'userImage', maxCount: 1 },
    { name: 'companyLogoImage', maxCount: 1 },
  ]))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createStory(
    @Body() createStoryDto: CreateStoryDto,
    @UploadedFiles() files: { userImage?: Express.Multer.File[]; companyLogoImage?: Express.Multer.File[] },
  ) {
    if (!files.userImage || !files.companyLogoImage) {
      throw new BadRequestException('Both userImage and companyLogoImage are required');
    }

    const userImageUrl = await this.imageUploaderService.uploadImage(files.userImage[0], 'stories/users', Date.now().toString());
    const companyLogoUrl = await this.imageUploaderService.uploadImage(files.companyLogoImage[0], 'stories/companies', Date.now().toString());

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
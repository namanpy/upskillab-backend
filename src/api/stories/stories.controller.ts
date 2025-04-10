// import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFiles, UseInterceptors, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
// import { StoriesLogicService } from './stories.logic';
// import { CreateStoryDto, GetStoriesResponseDTO } from '../../dto/stories.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';
// import { ImageUploaderService } from '../../common/services/image-uploader.service';

// @ApiTags('stories')
// @Controller('stories')
// export class StoriesController {
//   constructor(
//     private storiesLogicService: StoriesLogicService,
//     private imageUploaderService: ImageUploaderService,
//   ) {}

//   @ApiResponse({ status: 200, description: 'Get all stories', type: GetStoriesResponseDTO })
//   @Get('')
//   async getStories(): Promise<GetStoriesResponseDTO> {
//     return await this.storiesLogicService.getStories();
//   }

//   @ApiResponse({ status: 201, description: 'Create a new story with image uploads' })
//   @Post('')
//   @UseInterceptors(FileFieldsInterceptor([
//     { name: 'userImage', maxCount: 1 },
//     { name: 'companyLogoImage', maxCount: 1 },
//   ]))
//   @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
//   async createStory(
//     @Body() createStoryDto: CreateStoryDto,
//     @UploadedFiles() files: { userImage?: Express.Multer.File[]; companyLogoImage?: Express.Multer.File[] },
//   ) {
//     if (!files.userImage || !files.companyLogoImage) {
//       throw new BadRequestException('Both userImage and companyLogoImage are required');
//     }

//     const userImageUrl = await this.imageUploaderService.uploadImage(files.userImage[0], 'stories/users', Date.now().toString());
//     const companyLogoUrl = await this.imageUploaderService.uploadImage(files.companyLogoImage[0], 'stories/companies', Date.now().toString());

//     const storyData = { ...createStoryDto, userImageUrl, companyLogoUrl };

//     return await this.storiesLogicService.createStory(storyData);
//   }

//   @ApiResponse({ status: 200, description: 'Get a single story by ID' })
//   @Get(':id')
//   async getStoryById(@Param('id') id: string) {
//     return await this.storiesLogicService.getStoryById(id);
//   }

//   @ApiResponse({ status: 200, description: 'Update a story by ID' })
//   @Put(':id')
//   async updateStory(@Param('id') id: string, @Body() updateStoryDto: Partial<CreateStoryDto>) {
//     return await this.storiesLogicService.updateStory(id, updateStoryDto);
//   }

//   @ApiResponse({ status: 200, description: 'Delete a story by ID' })
//   @Delete(':id')
//   async deleteStory(@Param('id') id: string) {
//     return await this.storiesLogicService.deleteStory(id);
//   }
// }

import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { StoryLogicService } from './stories.logic';
import { CreateStoryDto, GetStoriesResponseDTO } from '../../dto/stories.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express'; // Use FileFieldsInterceptor instead
import { ImageUploaderService } from '../../common/services/image-uploader.service';

@ApiTags('stories')
@Controller('stories')
export class StoryController {
  constructor(
    private storyLogicService: StoryLogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({ status: 200, description: 'Get all stories', type: GetStoriesResponseDTO })
  @Get('')
  async getStories(): Promise<GetStoriesResponseDTO> {
    return await this.storyLogicService.getStories();
  }

  @ApiResponse({ status: 201, description: 'Create a new story with user image and company logo uploads' })
  @Post('')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'userImage', maxCount: 1 }, // Field for user image
    { name: 'companyLogoImage', maxCount: 1 }, // Field for company logo
  ]))
  async createStory(
    @Body() createStoryDto: CreateStoryDto,
    @UploadedFiles() files: { userImage?: Express.Multer.File[]; companyLogoImage?: Express.Multer.File[] },
  ) {
    if (!files.userImage || !files.companyLogoImage) {
      throw new BadRequestException('Both userImage and companyLogoImage files are required');
    }

    const userImageUrl = await this.imageUploaderService.uploadImage(files.userImage[0], 'stories/user-images', Date.now().toString());
    const companyLogoUrl = await this.imageUploaderService.uploadImage(files.companyLogoImage[0], 'stories/company-logos', `${Date.now()}-logo`);
    const storyData = { ...createStoryDto, userImageUrl, companyLogoUrl };

    return await this.storyLogicService.createStory(storyData);
  }

  @ApiResponse({ status: 200, description: 'Get a single story by ID' })
  @Get(':id')
  async getStoryById(@Param('id') id: string) {
    return await this.storyLogicService.getStoryById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a story by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'userImage', maxCount: 1 },
    { name: 'companyLogoImage', maxCount: 1 },
  ]))
  async updateStory(
    @Param('id') id: string,
    @Body() updateStoryDto: Partial<CreateStoryDto>,
    @UploadedFiles() files?: { userImage?: Express.Multer.File[]; companyLogoImage?: Express.Multer.File[] },
  ) {
    let storyData: Partial<CreateStoryDto & { userImageUrl: string; companyLogoUrl: string }> = { ...updateStoryDto };

    if (files) {
      if (files.userImage && files.userImage[0]) {
        const userImageUrl = await this.imageUploaderService.uploadImage(files.userImage[0], 'stories/user-images', `${id}-${Date.now()}`);
        storyData = { ...storyData, userImageUrl };
      }
      if (files.companyLogoImage && files.companyLogoImage[0]) {
        const companyLogoUrl = await this.imageUploaderService.uploadImage(files.companyLogoImage[0], 'stories/company-logos', `${id}-${Date.now()}-logo`);
        storyData = { ...storyData, companyLogoUrl };
      }
    }

    return await this.storyLogicService.updateStory(id, storyData);
  }

  @ApiResponse({ status: 200, description: 'Partially update a story by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'userImage', maxCount: 1 },
    { name: 'companyLogoImage', maxCount: 1 },
  ]))
  async patchStory(
    @Param('id') id: string,
    @Body() updateStoryDto: Partial<CreateStoryDto>,
    @UploadedFiles() files?: { userImage?: Express.Multer.File[]; companyLogoImage?: Express.Multer.File[] },
  ) {
    let storyData: Partial<CreateStoryDto & { userImageUrl: string; companyLogoUrl: string }> = { ...updateStoryDto };

    if (files) {
      if (files.userImage && files.userImage[0]) {
        const userImageUrl = await this.imageUploaderService.uploadImage(files.userImage[0], 'stories/user-images', `${id}-${Date.now()}`);
        storyData = { ...storyData, userImageUrl };
      }
      if (files.companyLogoImage && files.companyLogoImage[0]) {
        const companyLogoUrl = await this.imageUploaderService.uploadImage(files.companyLogoImage[0], 'stories/company-logos', `${id}-${Date.now()}-logo`);
        storyData = { ...storyData, companyLogoUrl };
      }
    }

    return await this.storyLogicService.updateStory(id, storyData);
  }

  @ApiResponse({ status: 200, description: 'Delete a story by ID' })
  @Delete(':id')
  async deleteStory(@Param('id') id: string) {
    return await this.storyLogicService.deleteStory(id);
  }
}
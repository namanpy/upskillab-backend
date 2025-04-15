import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { PremiumLearningExperienceLogicService } from './premium-learning-experience.logic';
import { CreatePremiumLearningExperienceDto, UpdatePremiumLearningExperienceDto, GetPremiumLearningExperiencesResponseDTO } from '../../../dto/home/premium-learning-experience.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';

@ApiTags('premium-learning-experiences')
@Controller('premium-learning-experiences')
export class PremiumLearningExperienceController {
  constructor(
    private premiumLearningExperienceLogicService: PremiumLearningExperienceLogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({ status: 200, description: 'Get all premium learning experiences', type: GetPremiumLearningExperiencesResponseDTO })
  @Get('')
  async getPremiumLearningExperiences(): Promise<GetPremiumLearningExperiencesResponseDTO> {
    return await this.premiumLearningExperienceLogicService.getPremiumLearningExperiences();
  }

  @ApiResponse({ status: 201, description: 'Create a new premium learning experience with image upload' })
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async createPremiumLearningExperience(@Body() createPremiumLearningExperienceDto: CreatePremiumLearningExperienceDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = await this.imageUploaderService.uploadImage(file, 'premium-learning-experiences', Date.now().toString());
    const experienceData = { ...createPremiumLearningExperienceDto, imageUrl };

    const createdExperience = await this.premiumLearningExperienceLogicService.createPremiumLearningExperience(experienceData as CreatePremiumLearningExperienceDto & { imageUrl: string });
    return {
      ...createdExperience,
      imageUrl, // Ensure imageUrl is returned
    };
  }

  @ApiResponse({ status: 200, description: 'Get a single premium learning experience by ID' })
  @Get(':id')
  async getPremiumLearningExperienceById(@Param('id') id: string) {
    return await this.premiumLearningExperienceLogicService.getPremiumLearningExperienceById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a premium learning experience by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updatePremiumLearningExperience(
    @Param('id') id: string,
    @Body() updatePremiumLearningExperienceDto: UpdatePremiumLearningExperienceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let experienceData: Partial<UpdatePremiumLearningExperienceDto & { imageUrl?: string }> = { ...updatePremiumLearningExperienceDto };

    let newImageUrl: string | undefined;
    if (file) {
      newImageUrl = await this.imageUploaderService.uploadImage(file, 'premium-learning-experiences', `${id}-${Date.now()}`);
      experienceData = { ...experienceData, imageUrl: newImageUrl };
    } else if (!experienceData.imageUrl) {
      const existingExperience = await this.premiumLearningExperienceLogicService.getPremiumLearningExperienceById(id);
      if (existingExperience && existingExperience.premiumLearningExperience.imageUrl) {
        experienceData.imageUrl = existingExperience.premiumLearningExperience.imageUrl;
      }
    }

    const updatedExperience = await this.premiumLearningExperienceLogicService.updatePremiumLearningExperience(id, experienceData);
    return {
      ...updatedExperience,
      imageUrl: newImageUrl || updatedExperience.premiumLearningExperience.imageUrl, // Return new or existing imageUrl
    };
  }

  @ApiResponse({ status: 200, description: 'Partially update a premium learning experience by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async patchPremiumLearningExperience(
    @Param('id') id: string,
    @Body() updatePremiumLearningExperienceDto: UpdatePremiumLearningExperienceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let experienceData: Partial<UpdatePremiumLearningExperienceDto & { imageUrl?: string }> = { ...updatePremiumLearningExperienceDto };

    let newImageUrl: string | undefined;
    if (file) {
      newImageUrl = await this.imageUploaderService.uploadImage(file, 'premium-learning-experiences', `${id}-${Date.now()}`);
      experienceData = { ...experienceData, imageUrl: newImageUrl };
    } else if (!experienceData.imageUrl) {
      const existingExperience = await this.premiumLearningExperienceLogicService.getPremiumLearningExperienceById(id);
      if (existingExperience && existingExperience.premiumLearningExperience.imageUrl) {
        experienceData.imageUrl = existingExperience.premiumLearningExperience.imageUrl;
      }
    }

    const updatedExperience = await this.premiumLearningExperienceLogicService.updatePremiumLearningExperience(id, experienceData);
    return {
      ...updatedExperience,
      imageUrl: newImageUrl || updatedExperience.premiumLearningExperience.imageUrl, // Return new or existing imageUrl
    };
  }

  @ApiResponse({ status: 200, description: 'Delete a premium learning experience by ID' })
  @Delete(':id')
  async deletePremiumLearningExperience(@Param('id') id: string) {
    return await this.premiumLearningExperienceLogicService.deletePremiumLearningExperience(id);
  }
}
// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Body,
//   Param,
//   UploadedFile,
//   UseInterceptors,
//   BadRequestException,
//   UsePipes,
// } from '@nestjs/common';
// import { PremiumLearningExperienceLogicService } from './premium-learning-experience.logic';
// import { CreatePremiumLearningExperienceDto, GetPremiumLearningExperiencesResponseDTO  } from '../../../dto/home/premium-learning-experience.dto';
// // import { } from '../../dto/premium-learning-experience.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ImageUploaderService } from '../../../common/services/image-uploader.service';
// import { TransformBooleanPipe } from '../../../common/pipes/transform-boolean.pipe';

// @ApiTags('premium-learning-experiences')
// @Controller('premium-learning-experiences')
// export class PremiumLearningExperienceController {
//   constructor(
//     private premiumLearningExperienceLogicService: PremiumLearningExperienceLogicService,
//     private imageUploaderService: ImageUploaderService,
//   ) {}

//   @ApiResponse({
//     status: 200,
//     description: 'Get all premium learning experiences',
//     type: GetPremiumLearningExperiencesResponseDTO,
//   })
//   @Get('')
//   async getPremiumLearningExperiences(): Promise<GetPremiumLearningExperiencesResponseDTO> {
//     return await this.premiumLearningExperienceLogicService.getPremiumLearningExperiences();
//   }

//   @ApiResponse({
//     status: 201,
//     description: 'Create a new premium learning experience with image upload',
//   })
//   @Post('')
//   @UseInterceptors(FileInterceptor('image'))
//   @UsePipes(new TransformBooleanPipe())
//   async createPremiumLearningExperience(
//     @Body() createPremiumLearningExperienceDto: CreatePremiumLearningExperienceDto,
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     if (!file) {
//       throw new BadRequestException('Image file is required');
//     }

//     const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (!allowedMimeTypes.includes(file.mimetype)) {
//       throw new BadRequestException('Only JPEG, PNG, and GIF images are allowed');
//     }

//     const imageUrl = await this.imageUploaderService.uploadImage(file, 'premium-learning-experiences', Date.now().toString());
//     const pleData = { ...createPremiumLearningExperienceDto, imageUrl };

//     return await this.premiumLearningExperienceLogicService.createPremiumLearningExperience(pleData);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Get a single premium learning experience by ID',
//   })
//   @Get(':id')
//   async getPremiumLearningExperienceById(@Param('id') id: string) {
//     return await this.premiumLearningExperienceLogicService.getPremiumLearningExperienceById(id);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Update a premium learning experience by ID',
//   })
//   @Put(':id')
//   async updatePremiumLearningExperience(
//     @Param('id') id: string,
//     @Body() updatePremiumLearningExperienceDto: Partial<CreatePremiumLearningExperienceDto>,
//   ) {
//     return await this.premiumLearningExperienceLogicService.updatePremiumLearningExperience(id, updatePremiumLearningExperienceDto);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Delete a premium learning experience by ID',
//   })
//   @Delete(':id')
//   async deletePremiumLearningExperience(@Param('id') id: string) {
//     return await this.premiumLearningExperienceLogicService.deletePremiumLearningExperience(id);
//   }
// }


import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { PremiumLearningExperienceLogicService } from './premium-learning-experience.logic';
import { CreatePremiumLearningExperienceDto, GetPremiumLearningExperiencesResponseDTO } from '../../../dto/home/premium-learning-experience.dto';
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
  async createPremiumLearningExperience(
    @Body() createPremiumLearningExperienceDto: CreatePremiumLearningExperienceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = await this.imageUploaderService.uploadImage(file, 'premium-learning-experiences', Date.now().toString());
    const premiumLearningExperienceData = { ...createPremiumLearningExperienceDto, imageUrl };

    return await this.premiumLearningExperienceLogicService.createPremiumLearningExperience(premiumLearningExperienceData);
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
    @Body() updatePremiumLearningExperienceDto: Partial<CreatePremiumLearningExperienceDto>,
    @UploadedFile() file?: Express.Multer.File, // Image is optional
  ) {
    let premiumLearningExperienceData: Partial<CreatePremiumLearningExperienceDto & { imageUrl: string }> = {
      ...updatePremiumLearningExperienceDto,
    };

    if (file) {
      const imageUrl = await this.imageUploaderService.uploadImage(file, 'premium-learning-experiences', `${id}-${Date.now()}`);
      premiumLearningExperienceData = { ...premiumLearningExperienceData, imageUrl };
    }

    return await this.premiumLearningExperienceLogicService.updatePremiumLearningExperience(id, premiumLearningExperienceData);
  }

  @ApiResponse({ status: 200, description: 'Partially update a premium learning experience by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async patchPremiumLearningExperience(
    @Param('id') id: string,
    @Body() updatePremiumLearningExperienceDto: Partial<CreatePremiumLearningExperienceDto>,
    @UploadedFile() file?: Express.Multer.File, // Image is optional
  ) {
    let premiumLearningExperienceData: Partial<CreatePremiumLearningExperienceDto & { imageUrl: string }> = {
      ...updatePremiumLearningExperienceDto,
    };

    if (file) {
      const imageUrl = await this.imageUploaderService.uploadImage(file, 'premium-learning-experiences', `${id}-${Date.now()}`);
      premiumLearningExperienceData = { ...premiumLearningExperienceData, imageUrl };
    }

    return await this.premiumLearningExperienceLogicService.updatePremiumLearningExperience(id, premiumLearningExperienceData);
  }

  @ApiResponse({ status: 200, description: 'Delete a premium learning experience by ID' })
  @Delete(':id')
  async deletePremiumLearningExperience(@Param('id') id: string) {
    return await this.premiumLearningExperienceLogicService.deletePremiumLearningExperience(id);
  }
}
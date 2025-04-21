import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFiles, UseInterceptors, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { University2LogicService } from './university2.logic';
import { CreateUniversity2Dto, GetUniversity2sResponseDTO } from '../../../dto/universities/university2.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';

@ApiTags('university2')
@Controller('university2')
export class University2Controller {
  constructor(
    private university2LogicService: University2LogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({ status: 200, description: 'Get all universities', type: GetUniversity2sResponseDTO })
  @Get('')
  async getUniversities(): Promise<GetUniversity2sResponseDTO> {
    const universities = await this.university2LogicService.getUniversities();
    return { universities };
  }

  @ApiResponse({ status: 201, description: 'Create a new university with image and logo upload' })
  @Post('')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Enable validation for DTO
  async createUniversity(
    @Body() createUniversityDto: CreateUniversity2Dto,
    @UploadedFiles() files: { image?: Express.Multer.File[]; logo?: Express.Multer.File[] },
  ) {
    const imageFile = files.image?.[0];
    const logoFile = files.logo?.[0];

    if (!imageFile) {
      throw new BadRequestException('Image file is required');
    }
    if (!logoFile) {
      throw new BadRequestException('Logo file is required');
    }

    const imageUrl = await this.imageUploaderService.uploadImage(imageFile, 'university2', Date.now().toString());
    const logoUrl = await this.imageUploaderService.uploadImage(logoFile, 'university2/logos', Date.now().toString());
    const universityData = { ...createUniversityDto, imageUrl, logoUrl };

    return await this.university2LogicService.createUniversity(universityData);
  }

  @ApiResponse({ status: 200, description: 'Get a single university by ID' })
  @Get(':id')
  async getUniversityById(@Param('id') id: string) {
    return await this.university2LogicService.getUniversityById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a university by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Enable validation for DTO
  async updateUniversity(
    @Param('id') id: string,
    @Body() updateUniversityDto: Partial<CreateUniversity2Dto>,
    @UploadedFiles() files: { image?: Express.Multer.File[]; logo?: Express.Multer.File[] },
  ) {
    let universityData: Partial<CreateUniversity2Dto & { imageUrl?: string; logoUrl?: string }> = { ...updateUniversityDto };

    const imageFile = files.image?.[0];
    const logoFile = files.logo?.[0];

    if (imageFile) {
      const imageUrl = await this.imageUploaderService.uploadImage(imageFile, 'university2', `${id}-${Date.now()}`);
      universityData = { ...universityData, imageUrl };
    }
    if (logoFile) {
      const logoUrl = await this.imageUploaderService.uploadImage(logoFile, 'university2/logos', `${id}-${Date.now()}`);
      universityData = { ...universityData, logoUrl };
    }

    return await this.university2LogicService.updateUniversity(id, universityData);
  }

  @ApiResponse({ status: 200, description: 'Partially update a university by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Enable validation for DTO
  async patchUniversity(
    @Param('id') id: string,
    @Body() updateUniversityDto: Partial<CreateUniversity2Dto>,
    @UploadedFiles() files: { image?: Express.Multer.File[]; logo?: Express.Multer.File[] },
  ) {
    let universityData: Partial<CreateUniversity2Dto & { imageUrl?: string; logoUrl?: string }> = { ...updateUniversityDto };

    const imageFile = files.image?.[0];
    const logoFile = files.logo?.[0];

    if (imageFile) {
      const imageUrl = await this.imageUploaderService.uploadImage(imageFile, 'university2', `${id}-${Date.now()}`);
      universityData = { ...universityData, imageUrl };
    }
    if (logoFile) {
      const logoUrl = await this.imageUploaderService.uploadImage(logoFile, 'university2/logos', `${id}-${Date.now()}`);
      universityData = { ...universityData, logoUrl };
    }

    return await this.university2LogicService.updateUniversity(id, universityData);
  }

  @ApiResponse({ status: 200, description: 'Delete a university by ID' })
  @Delete(':id')
  async deleteUniversity(@Param('id') id: string) {
    return await this.university2LogicService.deleteUniversity(id);
  }
}
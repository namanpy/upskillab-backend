// import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
// import { UniversityLogicService } from './university.logic';
// import { CreateUniversityDto } from '../../dto/university.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ImageUploaderService } from '../../common/services/image-uploader.service';

// @ApiTags('universities')
// @Controller('universities')
// export class UniversityController {
//   constructor(
//     private universityLogicService: UniversityLogicService,
//     private imageUploaderService: ImageUploaderService,
//   ) {}

//   @ApiResponse({ status: 200, description: 'Get all universities', type: [CreateUniversityDto] })
//   @Get('')
//   async getUniversities(): Promise<CreateUniversityDto[]> {
//     return await this.universityLogicService.getUniversities();
//   }

//   @ApiResponse({ status: 201, description: 'Create a new university with image upload' })
//   @Post('')
//   @UseInterceptors(FileInterceptor('image'))
//   async createUniversity(@Body() createUniversityDto: Partial<CreateUniversityDto>, @UploadedFile() file: Express.Multer.File) {
//     if (!file) {
//       throw new BadRequestException('Image file is required');
//     }

//     const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', Date.now().toString());
//     const universityData = { ...createUniversityDto, imageUrl };

//     // Validate programs as non-empty array of strings
//     if (!universityData.programs || !Array.isArray(universityData.programs) || universityData.programs.length === 0 || universityData.programs.some(p => !p || typeof p !== 'string')) {
//       throw new BadRequestException('Programs must be a non-empty array of non-empty strings');
//     }

//     return await this.universityLogicService.createUniversity(universityData as CreateUniversityDto & { imageUrl: string });
//   }

//   @ApiResponse({ status: 200, description: 'Get a single university by ID' })
//   @Get(':id')
//   async getUniversityById(@Param('id') id: string) {
//     return await this.universityLogicService.getUniversityById(id);
//   }

//   @ApiResponse({ status: 200, description: 'Update a university by ID (fields optional)' })
//   @Put(':id')
//   @UseInterceptors(FileInterceptor('image'))
//   async updateUniversity(
//     @Param('id') id: string,
//     @Body() updateUniversityDto: Partial<CreateUniversityDto>,
//     @UploadedFile() file?: Express.Multer.File,
//   ) {
//     let universityData: Partial<CreateUniversityDto & { imageUrl: string }> = { ...updateUniversityDto };

//     if (file) {
//       const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', `${id}-${Date.now()}`);
//       universityData = { ...universityData, imageUrl };
//     }

//     if (universityData.programs && (!Array.isArray(universityData.programs) || universityData.programs.length === 0 || universityData.programs.some(p => !p || typeof p !== 'string'))) {
//       throw new BadRequestException('Programs must be a non-empty array of non-empty strings');
//     }

//     return await this.universityLogicService.updateUniversity(id, universityData);
//   }

//   @ApiResponse({ status: 200, description: 'Partially update a university by ID (fields optional)' })
//   @Patch(':id')
//   @UseInterceptors(FileInterceptor('image'))
//   async patchUniversity(
//     @Param('id') id: string,
//     @Body() updateUniversityDto: Partial<CreateUniversityDto>,
//     @UploadedFile() file?: Express.Multer.File,
//   ) {
//     let universityData: Partial<CreateUniversityDto & { imageUrl: string }> = { ...updateUniversityDto };

//     if (file) {
//       const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', `${id}-${Date.now()}`);
//       universityData = { ...universityData, imageUrl };
//     }

//     if (universityData.programs && (!Array.isArray(universityData.programs) || universityData.programs.length === 0 || universityData.programs.some(p => !p || typeof p !== 'string'))) {
//       throw new BadRequestException('Programs must be a non-empty array of non-empty strings');
//     }

//     return await this.universityLogicService.updateUniversity(id, universityData);
//   }

//   @ApiResponse({ status: 200, description: 'Delete a university by ID' })
//   @Delete(':id')
//   async deleteUniversity(@Param('id') id: string) {
//     return await this.universityLogicService.deleteUniversity(id);
//   }
// }

import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { UniversityLogicService } from './university.logic';
import { CreateUniversityDto } from '../../dto/university.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../common/services/image-uploader.service';

@ApiTags('universities')
@Controller('universities')
export class UniversityController {
  constructor(
    private universityLogicService: UniversityLogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({ status: 200, description: 'Get all universities', type: [CreateUniversityDto] })
  @Get('')
  async getUniversities(): Promise<CreateUniversityDto[]> {
    return await this.universityLogicService.getUniversities();
  }

  @ApiResponse({ status: 201, description: 'Create a new university with image and logo upload' })
  @Post('')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]))
  async createUniversity(@Body() createUniversityDto: Partial<CreateUniversityDto>, @UploadedFiles() files: { image?: Express.Multer.File[], logo?: Express.Multer.File[] }) {
    const imageFile = files.image?.[0];
    const logoFile = files.logo?.[0];

    if (!imageFile) {
      throw new BadRequestException('Image file is required');
    }
    if (!logoFile) {
      throw new BadRequestException('Logo file is required');
    }

    const imageUrl = await this.imageUploaderService.uploadImage(imageFile, 'universities', Date.now().toString());
    const logoUrl = await this.imageUploaderService.uploadImage(logoFile, 'universities/logos', Date.now().toString());
    const universityData = { ...createUniversityDto, imageUrl, logoUrl };

    // Validate programs as non-empty array of strings
    if (!universityData.programs || !Array.isArray(universityData.programs) || universityData.programs.length === 0 || universityData.programs.some(p => !p || typeof p !== 'string')) {
      throw new BadRequestException('Programs must be a non-empty array of non-empty strings');
    }

    return await this.universityLogicService.createUniversity(universityData as CreateUniversityDto & { imageUrl: string, logoUrl: string });
  }

  @ApiResponse({ status: 200, description: 'Get a single university by ID' })
  @Get(':id')
  async getUniversityById(@Param('id') id: string) {
    return await this.universityLogicService.getUniversityById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a university by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]))
  async updateUniversity(
    @Param('id') id: string,
    @Body() updateUniversityDto: Partial<CreateUniversityDto>,
    @UploadedFiles() files: { image?: Express.Multer.File[], logo?: Express.Multer.File[] },
  ) {
    let universityData: Partial<CreateUniversityDto & { imageUrl?: string, logoUrl?: string }> = { ...updateUniversityDto };

    const imageFile = files.image?.[0];
    const logoFile = files.logo?.[0];

    if (imageFile) {
      const imageUrl = await this.imageUploaderService.uploadImage(imageFile, 'universities', `${id}-${Date.now()}`);
      universityData = { ...universityData, imageUrl };
    }
    if (logoFile) {
      const logoUrl = await this.imageUploaderService.uploadImage(logoFile, 'universities/logos', `${id}-${Date.now()}`);
      universityData = { ...universityData, logoUrl };
    }

    if (universityData.programs && (!Array.isArray(universityData.programs) || universityData.programs.length === 0 || universityData.programs.some(p => !p || typeof p !== 'string'))) {
      throw new BadRequestException('Programs must be a non-empty array of non-empty strings');
    }

    return await this.universityLogicService.updateUniversity(id, universityData);
  }

  @ApiResponse({ status: 200, description: 'Partially update a university by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
  ]))
  async patchUniversity(
    @Param('id') id: string,
    @Body() updateUniversityDto: Partial<CreateUniversityDto>,
    @UploadedFiles() files: { image?: Express.Multer.File[], logo?: Express.Multer.File[] },
  ) {
    let universityData: Partial<CreateUniversityDto & { imageUrl?: string, logoUrl?: string }> = { ...updateUniversityDto };

    const imageFile = files.image?.[0];
    const logoFile = files.logo?.[0];

    if (imageFile) {
      const imageUrl = await this.imageUploaderService.uploadImage(imageFile, 'universities', `${id}-${Date.now()}`);
      universityData = { ...universityData, imageUrl };
    }
    if (logoFile) {
      const logoUrl = await this.imageUploaderService.uploadImage(logoFile, 'universities/logos', `${id}-${Date.now()}`);
      universityData = { ...universityData, logoUrl };
    }

    if (universityData.programs && (!Array.isArray(universityData.programs) || universityData.programs.length === 0 || universityData.programs.some(p => !p || typeof p !== 'string'))) {
      throw new BadRequestException('Programs must be a non-empty array of non-empty strings');
    }

    return await this.universityLogicService.updateUniversity(id, universityData);
  }

  @ApiResponse({ status: 200, description: 'Delete a university by ID' })
  @Delete(':id')
  async deleteUniversity(@Param('id') id: string) {
    return await this.universityLogicService.deleteUniversity(id);
  }
}
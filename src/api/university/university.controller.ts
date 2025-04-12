// import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
// import { UniversityLogicService } from './university.logic';
// import { CreateUniversityDto, GetUniversitiesResponseDTO, UpdateUniversityDto } from '../../dto/university.dto';
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

//   @ApiResponse({ status: 200, description: 'Get all universities', type: GetUniversitiesResponseDTO })
//   @Get('')
//   async getUniversities(): Promise<GetUniversitiesResponseDTO> {
//     return await this.universityLogicService.getUniversities();
//   }

//   @ApiResponse({ status: 201, description: 'Create a new university with image upload' })
//   @Post('')
//   @UseInterceptors(FileInterceptor('image'))
//   async createUniversity(
//     @Body() createUniversityDto: Omit<CreateUniversityDto, 'imageUrl'>, // Exclude imageUrl from validation
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     if (!file) {
//       throw new BadRequestException('Image file is required');
//     }

//     const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', Date.now().toString());
//     const universityData = { ...createUniversityDto, imageUrl, programType: JSON.parse(createUniversityDto.programType as any) }; // Parse programType if sent as string

//     return await this.universityLogicService.createUniversity(universityData);
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
//     @Body() updateUniversityDto: UpdateUniversityDto, // Use UpdateUniversityDto instead of Partial<CreateUniversityDto>
//     @UploadedFile() file?: Express.Multer.File,
//   ) {
//     let universityData: UpdateUniversityDto = { ...updateUniversityDto };

//     if (file) {
//       const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', `${id}-${Date.now()}`);
//       universityData = { ...universityData, imageUrl };
//     } else if (updateUniversityDto.imageUrl === undefined && !file) {
//       // Ensure imageUrl is not required if no new file is uploaded
//       delete universityData.imageUrl;
//     }

//     if (universityData.programType && typeof universityData.programType === 'string') {
//       universityData.programType = JSON.parse(universityData.programType as any); // Parse if sent as string
//     }

//     return await this.universityLogicService.updateUniversity(id, universityData);
//   }

//   @ApiResponse({ status: 200, description: 'Partially update a university by ID (fields optional)' })
//   @Patch(':id')
//   @UseInterceptors(FileInterceptor('image'))
//   async patchUniversity(
//     @Param('id') id: string,
//     @Body() updateUniversityDto: UpdateUniversityDto, // Use UpdateUniversityDto instead of Partial<CreateUniversityDto>
//     @UploadedFile() file?: Express.Multer.File,
//   ) {
//     let universityData: UpdateUniversityDto = { ...updateUniversityDto };

//     if (file) {
//       const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', `${id}-${Date.now()}`);
//       universityData = { ...universityData, imageUrl };
//     } else if (updateUniversityDto.imageUrl === undefined && !file) {
//       // Ensure imageUrl is not required if no new file is uploaded
//       delete universityData.imageUrl;
//     }

//     if (universityData.programType && typeof universityData.programType === 'string') {
//       universityData.programType = JSON.parse(universityData.programType as any); // Parse if sent as string
//     }

//     return await this.universityLogicService.patchUniversity(id, universityData);
//   }

//   @ApiResponse({ status: 200, description: 'Delete a university by ID' })
//   @Delete(':id')
//   async deleteUniversity(@Param('id') id: string) {
//     return await this.universityLogicService.deleteUniversity(id);
//   }
// }

import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { UniversityLogicService } from './university.logic';
import { CreateUniversityDto, GetUniversitiesResponseDTO, UpdateUniversityDto } from '../../dto/university.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../common/services/image-uploader.service';

class ProgramTypeTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && value.programType !== undefined) {
      console.log('Raw programType value:', value.programType); // Debug log
      if (typeof value.programType === 'string') {
        try {
          const parsed = JSON.parse(value.programType);
          if (Array.isArray(parsed)) {
            value.programType = parsed;
          } else {
            throw new Error('Parsed value is not an array');
          }
        } catch (e) {
          throw new BadRequestException('programType must be a valid JSON array string (e.g., "[\"UG Programs\", \"MBA\"]")');
        }
      } else if (!Array.isArray(value.programType)) {
        throw new BadRequestException('programType must be an array or a valid JSON array string');
      }
    }
    return value;
  }
}

@ApiTags('universities')
@Controller('universities')
export class UniversityController {
  constructor(
    private universityLogicService: UniversityLogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({ status: 200, description: 'Get all universities', type: GetUniversitiesResponseDTO })
  @Get('')
  async getUniversities(): Promise<GetUniversitiesResponseDTO> {
    return await this.universityLogicService.getUniversities();
  }

  @ApiResponse({ status: 201, description: 'Create a new university with image upload' })
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async createUniversity(
    @Body() createUniversityDto: Omit<CreateUniversityDto, 'imageUrl'>, // Exclude imageUrl from validation
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', Date.now().toString());
    const universityData = { ...createUniversityDto, imageUrl, programType: JSON.parse(createUniversityDto.programType as any) }; // Parse programType if sent as string

    return await this.universityLogicService.createUniversity(universityData);
  }

  @ApiResponse({ status: 200, description: 'Get a single university by ID' })
  @Get(':id')
  async getUniversityById(@Param('id') id: string) {
    return await this.universityLogicService.getUniversityById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a university by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateUniversity(
    @Param('id') id: string,
    @Body(new ProgramTypeTransformPipe()) updateUniversityDto: UpdateUniversityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('Processed updateUniversityDto:', updateUniversityDto); // Debug log
    const existingUniversity = await this.universityLogicService.getUniversityById(id);
    if (!existingUniversity.university) {
      throw new BadRequestException(`University with ID ${id} not found`);
    }

    let universityData: UpdateUniversityDto = { ...updateUniversityDto };

    if (file) {
      const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', `${id}-${Date.now()}`);
      universityData = { ...universityData, imageUrl };
    } else if (universityData.imageUrl === undefined) {
      universityData.imageUrl = existingUniversity.university.imageUrl; // Retain existing imageUrl
    }

    return await this.universityLogicService.updateUniversity(id, universityData);
  }

  @ApiResponse({ status: 200, description: 'Partially update a university by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async patchUniversity(
    @Param('id') id: string,
    @Body(new ProgramTypeTransformPipe()) updateUniversityDto: UpdateUniversityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('Processed patchUniversityDto:', updateUniversityDto); // Debug log
    const existingUniversity = await this.universityLogicService.getUniversityById(id);
    if (!existingUniversity.university) {
      throw new BadRequestException(`University with ID ${id} not found`);
    }

    let universityData: UpdateUniversityDto = { ...updateUniversityDto };

    if (file) {
      const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', `${id}-${Date.now()}`);
      universityData = { ...universityData, imageUrl };
    } else if (universityData.imageUrl === undefined) {
      universityData.imageUrl = existingUniversity.university.imageUrl; // Retain existing imageUrl
    }

    return await this.universityLogicService.updateUniversity(id, universityData);
  }

  @ApiResponse({ status: 200, description: 'Delete a university by ID' })
  @Delete(':id')
  async deleteUniversity(@Param('id') id: string) {
    return await this.universityLogicService.deleteUniversity(id);
  }
}
import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { UniversityCourse2LogicService } from './university-course-2.logic';
import { CreateUniversityCourse2Dto, UpdateUniversityCourse2Dto, GetUniversityCourse2sResponseDTO } from '../../../dto/universities/university-course-2.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploaderService } from '../../../common/services/image-uploader.service';

// @ApiTags('university-course-2')
// @Controller('university-course-2')
// export class UniversityCourse2Controller {
//   constructor(
//     private universityCourse2LogicService: UniversityCourse2LogicService,
//     private imageUploaderService: ImageUploaderService,
//   ) {}

//   @ApiResponse({ status: 200, description: 'Get all university courses', type: GetUniversityCourse2sResponseDTO })
//   @Get('')
//   async getUniversityCourses(): Promise<GetUniversityCourse2sResponseDTO> {
//     return await this.universityCourse2LogicService.getUniversityCourses();
//   }

//   @ApiResponse({ status: 201, description: 'Create a new university course with image upload' })
//   @Post('')
//   @UseInterceptors(FileInterceptor('image'))
//   async createUniversityCourse(@Body() createUniversityCourseDto: Partial<CreateUniversityCourse2Dto>, @UploadedFile() file: Express.Multer.File) {
//     if (!file) {
//       throw new BadRequestException('Image file is required');
//     }

//     const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', Date.now().toString());
//     const courseData = { ...createUniversityCourseDto, imageUrl } as CreateUniversityCourse2Dto & { imageUrl: string };

//     return await this.universityCourse2LogicService.createUniversityCourse(courseData);
//   }

//   @ApiResponse({ status: 200, description: 'Get a single university course by ID' })
//   @Get(':id')
//   async getUniversityCourseById(@Param('id') id: string) {
//     return await this.universityCourse2LogicService.getUniversityCourseById(id);
//   }

//   @ApiResponse({ status: 200, description: 'Update a university course by ID (fields optional)' })
//   @Put(':id')
//   @UseInterceptors(FileInterceptor('image'))
//   async updateUniversityCourse(
//     @Param('id') id: string,
//     @Body() updateUniversityCourseDto: UpdateUniversityCourse2Dto,
//     @UploadedFile() file?: Express.Multer.File,
//   ) {
//     let courseData: Partial<UpdateUniversityCourse2Dto & { imageUrl?: string }> = { ...updateUniversityCourseDto };

//     if (file) {
//       const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', `${id}-${Date.now()}`);
//       courseData = { ...courseData, imageUrl };
//     } else if (!courseData.imageUrl) {
//       const existingCourse = await this.universityCourse2LogicService.getUniversityCourseById(id);
//       if (existingCourse && existingCourse.universityCourse2.imageUrl) {
//         courseData.imageUrl = existingCourse.universityCourse2.imageUrl;
//       }
//     }

//     return await this.universityCourse2LogicService.updateUniversityCourse(id, courseData);
//   }

//   @ApiResponse({ status: 200, description: 'Partially update a university course by ID (fields optional)' })
//   @Patch(':id')
//   @UseInterceptors(FileInterceptor('image'))
//   async patchUniversityCourse(
//     @Param('id') id: string,
//     @Body() updateUniversityCourseDto: UpdateUniversityCourse2Dto,
//     @UploadedFile() file?: Express.Multer.File,
//   ) {
//     let courseData: Partial<UpdateUniversityCourse2Dto & { imageUrl?: string }> = { ...updateUniversityCourseDto };

//     if (file) {
//       const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', `${id}-${Date.now()}`);
//       courseData = { ...courseData, imageUrl };
//     } else if (!courseData.imageUrl) {
//       const existingCourse = await this.universityCourse2LogicService.getUniversityCourseById(id);
//       if (existingCourse && existingCourse.universityCourse2.imageUrl) {
//         courseData.imageUrl = existingCourse.universityCourse2.imageUrl;
//       }
//     }

//     return await this.universityCourse2LogicService.updateUniversityCourse(id, courseData);
//   }

//   @ApiResponse({ status: 200, description: 'Delete a university course by ID' })
//   @Delete(':id')
//   async deleteUniversityCourse(@Param('id') id: string) {
//     return await this.universityCourse2LogicService.deleteUniversityCourse(id);
//   }
// }


// import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
// import { UniversityCourse2LogicService } from './university-course-2.logic';
// import { CreateUniversityCourse2Dto, UpdateUniversityCourse2Dto, GetUniversityCourse2sResponseDTO } from '../../dto/university-course-2.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ImageUploaderService } from '../../common/services/image-uploader.service';

@ApiTags('university-course-2')
@Controller('university-course-2')
export class UniversityCourse2Controller {
  constructor(
    private universityCourse2LogicService: UniversityCourse2LogicService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  @ApiResponse({ status: 200, description: 'Get all university courses', type: GetUniversityCourse2sResponseDTO })
  @Get('')
  async getUniversityCourses(): Promise<GetUniversityCourse2sResponseDTO> {
    return await this.universityCourse2LogicService.getUniversityCourses();
  }

  @ApiResponse({ status: 201, description: 'Create a new university course with image upload' })
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async createUniversityCourse(@Body() createUniversityCourseDto: CreateUniversityCourse2Dto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', Date.now().toString());
    const courseData = { ...createUniversityCourseDto, imageUrl };

    return await this.universityCourse2LogicService.createUniversityCourse(courseData);
  }

  @ApiResponse({ status: 200, description: 'Get a single university course by ID' })
  @Get(':id')
  async getUniversityCourseById(@Param('id') id: string) {
    return await this.universityCourse2LogicService.getUniversityCourseById(id);
  }

  @ApiResponse({ status: 200, description: 'Update a university course by ID (fields optional)' })
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateUniversityCourse(
    @Param('id') id: string,
    @Body() updateUniversityCourseDto: UpdateUniversityCourse2Dto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let courseData: Partial<UpdateUniversityCourse2Dto & { imageUrl?: string }> = { ...updateUniversityCourseDto };

    if (file) {
      const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', `${id}-${Date.now()}`);
      courseData = { ...courseData, imageUrl };
    } else if (!courseData.imageUrl) {
      const existingCourse = await this.universityCourse2LogicService.getUniversityCourseById(id);
      if (existingCourse && existingCourse.universityCourse2.imageUrl) {
        courseData.imageUrl = existingCourse.universityCourse2.imageUrl;
      }
    }

    return await this.universityCourse2LogicService.updateUniversityCourse(id, courseData);
  }

  @ApiResponse({ status: 200, description: 'Partially update a university course by ID (fields optional)' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async patchUniversityCourse(
    @Param('id') id: string,
    @Body() updateUniversityCourseDto: UpdateUniversityCourse2Dto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let courseData: Partial<UpdateUniversityCourse2Dto & { imageUrl?: string }> = { ...updateUniversityCourseDto };

    if (file) {
      const imageUrl = await this.imageUploaderService.uploadImage(file, 'universities', `${id}-${Date.now()}`);
      courseData = { ...courseData, imageUrl };
    } else if (!courseData.imageUrl) {
      const existingCourse = await this.universityCourse2LogicService.getUniversityCourseById(id);
      if (existingCourse && existingCourse.universityCourse2.imageUrl) {
        courseData.imageUrl = existingCourse.universityCourse2.imageUrl;
      }
    }

    return await this.universityCourse2LogicService.updateUniversityCourse(id, courseData);
  }

  @ApiResponse({ status: 200, description: 'Delete a university course by ID' })
  @Delete(':id')
  async deleteUniversityCourse(@Param('id') id: string) {
    return await this.universityCourse2LogicService.deleteUniversityCourse(id);
  }
}
// import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
// import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
// import { CourseLogicService } from './course.logic';
// import { ERROR } from 'src/common/constants/error.constants';

// import {
//   CreateCourseRequestDto,
//   CreateCourseResponseDto,
//   GetCourseByCodeRequestDto,
//   GetCourseByCodeResponseDto,
//   //   CreateCourseRequestDto,
//   //   CreateCourseResponseDto,
//   GetCourseDisplayRequestDto,
//   GetCourseDisplayResponseDto,
//   UpdateCourseRequestDto,
//   UpdateCourseRequestParamDto,
//   UpdateCourseResponseDto,
//   //   UpdateCourseRequestBodyDto,
//   //   UpdateCourseRequestParamsDto,
//   //   UpdateCourseResponseDto,
// } from 'src/dto/course/course.dto';

// @Controller('course')
// export class CourseController {
//   constructor(private courseLogicService: CourseLogicService) {}

//   @ApiBody({
//     type: CreateCourseRequestDto,
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Create course',
//     type: CreateCourseResponseDto,
//   })
//   @ApiResponse({
//     status: ERROR.COURSE_ALREADY_EXISTS.code,
//     description: ERROR.COURSE_ALREADY_EXISTS.message,
//     example: ERROR.COURSE_ALREADY_EXISTS,
//   })
//   @Post('')
//   async createCourse(
//     @Body() body: CreateCourseRequestDto,
//   ): Promise<CreateCourseResponseDto> {
//     return await this.courseLogicService.createCourse(body);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Get courses for display',
//     type: GetCourseDisplayResponseDto,
//   })
//   @Get('/display')
//   async getCourseDisplay(
//     @Query() query: GetCourseDisplayRequestDto,
//   ): Promise<GetCourseDisplayResponseDto> {
//     return await this.courseLogicService.getCourseDisplay(query);
//   }

//   @ApiResponse({
//     status: 200,
//     description: 'Get courses for display',
//     type: GetCourseDisplayResponseDto,
//   })
//   @Post('/display')
//   async postCourseDisplay(
//     @Body() body: GetCourseDisplayRequestDto,
//   ): Promise<GetCourseDisplayResponseDto> {
//     return await this.courseLogicService.getCourseDisplay(body);
//   }

//   //   @ApiBody({
//   //     type: UpdateCourseRequestBodyDto,
//   //   })
//   //   @ApiResponse({
//   //     status: 200,
//   //     description: 'Update course',
//   //     type: UpdateCourseResponseDto,
//   //   })
//   //   @ApiResponse({
//   //     status: ERROR.COURSE_NOT_FOUND.code,
//   //     description: ERROR.COURSE_NOT_FOUND.message,
//   //     example: ERROR.COURSE_NOT_FOUND,
//   //   })
//   //   @ApiResponse({
//   //     status: ERROR.COURSE_ALREADY_EXISTS.code,
//   //     description: ERROR.COURSE_ALREADY_EXISTS.message,
//   //     example: ERROR.COURSE_ALREADY_EXISTS,
//   //   })
//   @Put(':courseId')
//   @ApiResponse({
//     status: 200,
//     description: 'Update course with chapters and topics',
//     type: UpdateCourseResponseDto,
//   })
//   async updateCourse(
//     @Param() params: UpdateCourseRequestParamDto,
//     @Body() updateCourseDto: UpdateCourseRequestDto,
//   ): Promise<UpdateCourseResponseDto> {
//     return await this.courseLogicService.updateCourse({
//       ...params,
//       ...updateCourseDto,
//     });
//   }

//   @Get('code/:courseCode')
//   @ApiResponse({
//     status: 200,
//     description: 'Get course by code',
//     type: GetCourseByCodeResponseDto,
//   })
//   @ApiResponse({
//     status: ERROR.COURSE_NOT_FOUND.code,
//     description: ERROR.COURSE_NOT_FOUND.message,
//     example: ERROR.COURSE_NOT_FOUND,
//   })
//   async getCourseByCode(
//     @Param() params: GetCourseByCodeRequestDto,
//   ): Promise<GetCourseByCodeResponseDto> {
//     return await this.courseLogicService.getCourseByCode(params.courseCode);
//   }
// }

import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CourseLogicService } from './course.logic';
import { ERROR } from 'src/common/constants/error.constants';
import {
  CreateCourseRequestDto,
  CreateCourseResponseDto,
  GetCourseByCodeRequestDto,
  GetCourseByCodeResponseDto,
  GetCourseDisplayRequestDto,
  GetCourseDisplayResponseDto,
  UpdateCourseRequestDto,
  UpdateCourseRequestParamDto,
  GetCourseByIdRequestDto,
  UpdateCourseResponseDto,
} from 'src/dto/course/course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploaderService } from '../../common/services/file-uploader.service'; // Adjust path as per your project

@Controller('course')
export class CourseController {
  constructor(
    private courseLogicService: CourseLogicService,
    private fileUploaderService: FileUploaderService, // Inject FileUploaderService
  ) {}

  @ApiBody({
    type: CreateCourseRequestDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Create course',
    type: CreateCourseResponseDto,
  })
  @ApiResponse({
    status: ERROR.COURSE_ALREADY_EXISTS.code,
    description: ERROR.COURSE_ALREADY_EXISTS.message,
    example: ERROR.COURSE_ALREADY_EXISTS,
  })
  @Post('')
  @UseInterceptors(FileInterceptor('brochure')) // Intercept brochure field for PDF upload
  async createCourse(
    @Body() body: CreateCourseRequestDto,
    @UploadedFile() file?: Express.Multer.File, // Optional file
  ): Promise<CreateCourseResponseDto> {
    if (file) {
      // Validate MIME type (though FileUploaderService already checks)
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Only PDF files are allowed for brochure');
      }
      const uploadResults = await this.fileUploaderService.uploadFiles([file], 'courses');
      body.brochure = uploadResults[0].fileUrl; // Store the first URL in brochure
    }
    return await this.courseLogicService.createCourse(body);
  }

  @ApiResponse({
    status: 200,
    description: 'Get courses for display',
    type: GetCourseDisplayResponseDto,
  })
  @Get('/display')
  async getCourseDisplay(
    @Query() query: GetCourseDisplayRequestDto,
  ): Promise<GetCourseDisplayResponseDto> {
    return await this.courseLogicService.getCourseDisplay(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Get courses for display',
    type: GetCourseDisplayResponseDto,
  })
  @Post('/display')
  async postCourseDisplay(
    @Body() body: GetCourseDisplayRequestDto,
  ): Promise<GetCourseDisplayResponseDto> {
    return await this.courseLogicService.getCourseDisplay(body);
  }

  @Put(':courseId')
  @ApiResponse({
    status: 200,
    description: 'Update course with chapters and topics',
    type: UpdateCourseResponseDto,
  })
  @UseInterceptors(FileInterceptor('brochure')) // Intercept brochure field for PDF upload
  async updateCourse(
    @Param() params: UpdateCourseRequestParamDto,
    @Body() updateCourseDto: UpdateCourseRequestDto,
    @UploadedFile() file?: Express.Multer.File, // Optional file
  ): Promise<UpdateCourseResponseDto> {
    if (file) {
      // Validate MIME type
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Only PDF files are allowed for brochure');
      }
      const uploadResults = await this.fileUploaderService.uploadFiles([file], 'courses');
      updateCourseDto.brochure = uploadResults[0].fileUrl; // Store the first URL in brochure
    }
    return await this.courseLogicService.updateCourse({
      ...params,
      ...updateCourseDto,
    });
  }

  @Get('code/:courseCode')
  @ApiResponse({
    status: 200,
    description: 'Get course by code',
    type: GetCourseByCodeResponseDto,
  })
  @ApiResponse({
    status: ERROR.COURSE_NOT_FOUND.code,
    description: ERROR.COURSE_NOT_FOUND.message,
    example: ERROR.COURSE_NOT_FOUND,
  })
  async getCourseByCode(
    @Param() params: GetCourseByCodeRequestDto,
  ): Promise<GetCourseByCodeResponseDto> {
    return await this.courseLogicService.getCourseByCode(params.courseCode);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get course by code',
    type: GetCourseByCodeResponseDto,
  })
  @ApiResponse({
    status: ERROR.COURSE_NOT_FOUND.code,
    description: ERROR.COURSE_NOT_FOUND.message,
    example: ERROR.COURSE_NOT_FOUND,
  })
  async getCourseById(
    @Param() params: GetCourseByIdRequestDto,
  ): Promise<GetCourseByCodeResponseDto> {
    return await this.courseLogicService.getCourseById(params.id);
  }
}
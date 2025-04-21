// import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UsePipes, ValidationPipe, NotFoundException } from '@nestjs/common';
// import { UniversityCourseLogicService } from './university-course.logic';
// import { CreateUniversityCourseDto, GetUniversityCoursesResponseDTO } from '../../../dto/universities/university-course.dto';
// import { ApiResponse, ApiTags } from '@nestjs/swagger';

// @ApiTags('university-courses')
// @Controller('universitys/:universityId/courses')
// export class UniversityCourseController {
//   constructor(private universityCourseLogicService: UniversityCourseLogicService) {}

//   @ApiResponse({ status: 201, description: 'Create a new course for a university' })
//   @Post('')
//   @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
//   async createCourse(
//     @Param('universityId') universityId: string,
//     @Body() createCourseDto: CreateUniversityCourseDto,
//   ) {
//     const courseData = { ...createCourseDto, universityId };
//     return await this.universityCourseLogicService.createCourse(courseData);
//   }

//   @ApiResponse({ status: 200, description: 'Get all courses for a university' })
//   @Get('')
//   async getCoursesByUniversityId(@Param('universityId') universityId: string): Promise<GetUniversityCoursesResponseDTO> {
//     return await this.universityCourseLogicService.getCoursesByUniversityId(universityId);
//   }

//   @ApiResponse({ status: 200, description: 'Update a course for a university' })
//   @Put(':courseId')
//   @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
//   async updateCourse(
//     @Param('universityId') universityId: string,
//     @Param('courseId') courseId: string,
//     @Body() updateCourseDto: Partial<CreateUniversityCourseDto>,
//   ) {
//     return await this.universityCourseLogicService.updateCourse(universityId, courseId, updateCourseDto);
//   }

//   @ApiResponse({ status: 200, description: 'Partially update a course for a university' })
//   @Patch(':courseId')
//   @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
//   async patchCourse(
//     @Param('universityId') universityId: string,
//     @Param('courseId') courseId: string,
//     @Body() updateCourseDto: Partial<CreateUniversityCourseDto>,
//   ) {
//     return await this.universityCourseLogicService.updateCourse(universityId, courseId, updateCourseDto);
//   }

//   @ApiResponse({ status: 200, description: 'Delete a course for a university' })
//   @Delete(':courseId')
//   async deleteCourse(
//     @Param('universityId') universityId: string,
//     @Param('courseId') courseId: string,
//   ) {
//     const course = await this.universityCourseLogicService.updateCourse(universityId, courseId, { active: false });
//     if (!course) {
//       throw new NotFoundException(`Course with ID ${courseId} not found for university ID ${universityId}`);
//     }
//     return { message: 'Course marked as inactive' };
//   }
// }

import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UsePipes, ValidationPipe, NotFoundException } from '@nestjs/common';
import { UniversityCourseLogicService } from './university-course.logic';
import { CreateUniversityCourseDto, UniversityCourse, GetUniversityCoursesResponseDTO } from '../../../dto/universities/university-course.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { University2LogicService } from '../university2/university2.logic';
import { University2 } from '../../../dto/universities/university2.dto';

@ApiTags('university-courses')
@Controller('universitys/:universityId/courses')
export class UniversityCourseController {
  constructor(
    private universityCourseLogicService: UniversityCourseLogicService,
    private university2LogicService: University2LogicService, // Inject for university data
  ) {}

  @ApiResponse({ status: 201, description: 'Create a new course for a university' })
  @Post('')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createCourse(
    @Param('universityId') universityId: string,
    @Body() createCourseDto: CreateUniversityCourseDto,
  ) {
    const courseData = { ...createCourseDto, universityId };
    return await this.universityCourseLogicService.createCourse(courseData);
  }

  @ApiResponse({ status: 200, description: 'Get all courses for a university' })
  @Get('')
  async getCoursesByUniversityId(@Param('universityId') universityId: string): Promise<{ university: University2; courses: UniversityCourse[] }> {
    const universityResponse = await this.university2LogicService.getUniversityById(universityId);
    if (!universityResponse.university) {
      throw new NotFoundException(`University with ID ${universityId} not found`);
    }
    const coursesResponse = await this.universityCourseLogicService.getCoursesByUniversityId(universityId);
    return {
      university: universityResponse.university,
      courses: coursesResponse.courses,
    };
  }

  @ApiResponse({ status: 200, description: 'Get all courses for a university with detailed structure' })
  @Get('all')
  async getAllCoursesByUniversityId(@Param('universityId') universityId: string): Promise<{ university: University2; courses: UniversityCourse[] }> {
    const universityResponse = await this.university2LogicService.getUniversityById(universityId);
    if (!universityResponse.university) {
      throw new NotFoundException(`University with ID ${universityId} not found`);
    }
    const coursesResponse = await this.universityCourseLogicService.getCoursesByUniversityId(universityId);
    return {
      university: universityResponse.university,
      courses: coursesResponse.courses,
    };
  }

  @ApiResponse({ status: 200, description: 'Get a specific course with university details' })
  @Get(':courseId')
  async getCourseById(
    @Param('universityId') universityId: string,
    @Param('courseId') courseId: string,
  ): Promise<{ university: University2; course: UniversityCourse }> {
    const universityResponse = await this.university2LogicService.getUniversityById(universityId);
    if (!universityResponse.university) {
      throw new NotFoundException(`University with ID ${universityId} not found`);
    }

    const courses = await this.universityCourseLogicService.getCoursesByUniversityId(universityId);
    const course = courses.courses.find(c => c._id === courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found for university ID ${universityId}`);
    }

    return {
      university: universityResponse.university,
      course: course,
    };
  }

  @ApiResponse({ status: 200, description: 'Update a course for a university' })
  @Put(':courseId')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateCourse(
    @Param('universityId') universityId: string,
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: Partial<CreateUniversityCourseDto>,
  ) {
    return await this.universityCourseLogicService.updateCourse(universityId, courseId, updateCourseDto);
  }

  @ApiResponse({ status: 200, description: 'Partially update a course for a university' })
  @Patch(':courseId')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patchCourse(
    @Param('universityId') universityId: string,
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: Partial<CreateUniversityCourseDto>,
  ) {
    return await this.universityCourseLogicService.updateCourse(universityId, courseId, updateCourseDto);
  }

  @ApiResponse({ status: 200, description: 'Delete a course for a university' })
  @Delete(':courseId')
  async deleteCourse(
    @Param('universityId') universityId: string,
    @Param('courseId') courseId: string,
  ) {
    const course = await this.universityCourseLogicService.updateCourse(universityId, courseId, { active: false });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found for university ID ${universityId}`);
    }
    return { message: 'Course marked as inactive' };
  }
}
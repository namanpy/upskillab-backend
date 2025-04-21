import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversityCourseDataService } from './university-course.data';
import { CreateUniversityCourseDto, GetUniversityCoursesResponseDTO, UniversityCourse } from '../../../dto/universities/university-course.dto';
import { UniversityCourseDocument } from '../../../schemas/universities/university-course.schema';
import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

@Injectable()
export class UniversityCourseLogicService {
  constructor(private universityCourseDataService: UniversityCourseDataService) {}

  private mapToDto(course: UniversityCourseDocument): UniversityCourse {
    return mapToDto<UniversityCourse, UniversityCourseDocument>(course);
  }

  private mapToDtoArray(courses: UniversityCourseDocument[]): UniversityCourse[] {
    return mapToDtoArray<UniversityCourse, UniversityCourseDocument>(courses);
  }

  async createCourse(createCourseDto: CreateUniversityCourseDto & { universityId: string }) {
    const course = await this.universityCourseDataService.createCourse(createCourseDto);
    return {
      course: this.mapToDto(course),
    };
  }

  async getCoursesByUniversityId(universityId: string, activeOnly: boolean = false): Promise<GetUniversityCoursesResponseDTO> {
    let query = { universityId };
    if (activeOnly) query['active'] = true;
  
    const courses = await this.universityCourseDataService.getCoursesByUniversityId(universityId, query);
    if (!courses.length) {
      throw new NotFoundException(`No courses found for university ID ${universityId}`);
    }
    return { courses: this.mapToDtoArray(courses) };
  }

  async updateCourse(universityId: string, courseId: string, updateCourseDto: Partial<CreateUniversityCourseDto>) {
    const course = await this.universityCourseDataService.updateCourse(universityId, courseId, updateCourseDto);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found for university ID ${universityId}`);
    }
    return {
      course: this.mapToDto(course),
    };
  }
}
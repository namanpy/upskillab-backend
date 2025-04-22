import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversityCourse2DataService } from './university-course-2.data';
import { CreateUniversityCourse2Dto, GetUniversityCourse2sResponseDTO, UniversityCourse2 } from '../../../dto/universities/university-course-2.dto';
import { UniversityCourse2Document } from '../../../schemas/universities/university-course-2.schema';
import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

@Injectable()
export class UniversityCourse2LogicService {
  constructor(private universityCourse2DataService: UniversityCourse2DataService) {}

  private mapToDto(course: UniversityCourse2Document): UniversityCourse2 {
    return mapToDto<UniversityCourse2, UniversityCourse2Document>(course);
  }

  private mapToDtoArray(courses: UniversityCourse2Document[]): UniversityCourse2[] {
    return mapToDtoArray<UniversityCourse2, UniversityCourse2Document>(courses);
  }

  async getUniversityCourses(): Promise<GetUniversityCourse2sResponseDTO> {
    const courses = await this.universityCourse2DataService.getUniversityCourses();
    return {
      universityCourses: this.mapToDtoArray(courses),
    };
  }

  async createUniversityCourse(createUniversityCourseDto: CreateUniversityCourse2Dto & { imageUrl: string }) {
    const course = await this.universityCourse2DataService.createUniversityCourse(createUniversityCourseDto);
    return {
      universityCourse2: this.mapToDto(course),
    };
  }

  async getUniversityCourseById(id: string) {
    const course = await this.universityCourse2DataService.getUniversityCourseById(id);
    if (!course) {
      throw new NotFoundException(`University course with ID ${id} not found`);
    }
    return {
      universityCourse2: this.mapToDto(course),
    };
  }

  async updateUniversityCourse(id: string, updateUniversityCourseDto: Partial<CreateUniversityCourse2Dto & { imageUrl?: string }>) {
    const course = await this.universityCourse2DataService.updateUniversityCourse(id, updateUniversityCourseDto);
    if (!course) {
      throw new NotFoundException(`University course with ID ${id} not found`);
    }
    return {
      universityCourse2: this.mapToDto(course),
    };
  }

  async deleteUniversityCourse(id: string) {
    const course = await this.universityCourse2DataService.deleteUniversityCourse(id);
    if (!course) {
      throw new NotFoundException(`University course with ID ${id} not found`);
    }
    return { message: 'University course deleted successfully' };
  }
}
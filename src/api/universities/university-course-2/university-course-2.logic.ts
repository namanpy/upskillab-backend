// import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversityCourse2DataService } from './university-course-2.data';
// import { CreateUniversityCourse2Dto, GetUniversityCourse2sResponseDTO, UniversityCourse2 } from '../../../dto/universities/university-course-2.dto';
import { UniversityCourse2Document } from '../../../schemas/universities/university-course-2.schema';
import { mapToDto, mapToDtoArray } from '../../../common/utils/map-to-dto.util';

// @Injectable()
// export class UniversityCourse2LogicService {
//   constructor(private universityCourse2DataService: UniversityCourse2DataService) {}

//   private mapToDto(course: UniversityCourse2Document): UniversityCourse2 {
//     return mapToDto<UniversityCourse2, UniversityCourse2Document>(course);
//   }

//   private mapToDtoArray(courses: UniversityCourse2Document[]): UniversityCourse2[] {
//     return mapToDtoArray<UniversityCourse2, UniversityCourse2Document>(courses);
//   }

//   async getUniversityCourses(): Promise<GetUniversityCourse2sResponseDTO> {
//     const courses = await this.universityCourse2DataService.getUniversityCourses();
//     return {
//       universityCourses: this.mapToDtoArray(courses),
//     };
//   }

//   async createUniversityCourse(createUniversityCourseDto: CreateUniversityCourse2Dto & { imageUrl: string }) {
//     const course = await this.universityCourse2DataService.createUniversityCourse(createUniversityCourseDto);
//     return {
//       universityCourse2: this.mapToDto(course),
//     };
//   }

//   async getUniversityCourseById(id: string) {
//     const course = await this.universityCourse2DataService.getUniversityCourseById(id);
//     if (!course) {
//       throw new NotFoundException(`University course with ID ${id} not found`);
//     }
//     return {
//       universityCourse2: this.mapToDto(course),
//     };
//   }

//   async updateUniversityCourse(id: string, updateUniversityCourseDto: Partial<CreateUniversityCourse2Dto & { imageUrl?: string }>) {
//     const course = await this.universityCourse2DataService.updateUniversityCourse(id, updateUniversityCourseDto);
//     if (!course) {
//       throw new NotFoundException(`University course with ID ${id} not found`);
//     }
//     return {
//       universityCourse2: this.mapToDto(course),
//     };
//   }

//   async deleteUniversityCourse(id: string) {
//     const course = await this.universityCourse2DataService.deleteUniversityCourse(id);
//     if (!course) {
//       throw new NotFoundException(`University course with ID ${id} not found`);
//     }
//     return { message: 'University course deleted successfully' };
//   }
// }


import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { UniversityCourse2DataService } from './university-course-2.data';
import { CreateUniversityCourse2Dto, GetUniversityCourse2sResponseDTO, UniversityCourse2 } from '../../../dto/universities/university-course-2.dto';
// import { UniversityCourse2Document } from '../../schemas/university-course-2.schema';
// import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';
import { University2DataService } from '../university2/university2.data';

@Injectable()
export class UniversityCourse2LogicService {
  constructor(
    private universityCourse2DataService: UniversityCourse2DataService,
    private university2DataService: University2DataService,
  ) {}

  private async mapToDto(course: UniversityCourse2Document): Promise<UniversityCourse2> {
    const populatedCourse = await course.populate('universityId');
    const universityName = populatedCourse.universityId ? (populatedCourse.universityId as any).name : '';
    const dto = mapToDto<UniversityCourse2, UniversityCourse2Document>(course);
    return { ...dto, universityName };
  }

  private async mapToDtoArray(courses: UniversityCourse2Document[]): Promise<UniversityCourse2[]> {
    const populatedCourses = await Promise.all(courses.map(course => course.populate('universityId')));
    return populatedCourses.map(course => {
      const universityName = course.universityId ? (course.universityId as any).name : '';
      const dto = mapToDto<UniversityCourse2, UniversityCourse2Document>(course);
      return { ...dto, universityName };
    });
  }

  async getUniversityCourses(): Promise<GetUniversityCourse2sResponseDTO> {
    const courses = await this.universityCourse2DataService.getUniversityCourses();
    return {
      universityCourses: await this.mapToDtoArray(courses),
    };
  }

  async createUniversityCourse(createUniversityCourseDto: CreateUniversityCourse2Dto & { imageUrl: string }) {
    const university = await this.university2DataService.getUniversityById(createUniversityCourseDto.universityId);
    if (!university) {
      throw new BadRequestException(`University with ID ${createUniversityCourseDto.universityId} not found`);
    }

    const course = await this.universityCourse2DataService.createUniversityCourse(createUniversityCourseDto);
    return {
      universityCourse2: await this.mapToDto(course),
    };
  }

  async getUniversityCourseById(id: string) {
    const course = await this.universityCourse2DataService.getUniversityCourseById(id);
    if (!course) {
      throw new NotFoundException(`University course with ID ${id} not found`);
    }
    return {
      universityCourse2: await this.mapToDto(course),
    };
  }

  async updateUniversityCourse(id: string, updateUniversityCourseDto: Partial<CreateUniversityCourse2Dto & { imageUrl?: string }>) {
    if (updateUniversityCourseDto.universityId) {
      const university = await this.university2DataService.getUniversityById(updateUniversityCourseDto.universityId);
      if (!university) {
        throw new BadRequestException(`University with ID ${updateUniversityCourseDto.universityId} not found`);
      }
    }

    const course = await this.universityCourse2DataService.updateUniversityCourse(id, updateUniversityCourseDto);
    if (!course) {
      throw new NotFoundException(`University course with ID ${id} not found`);
    }
    return {
      universityCourse2: await this.mapToDto(course),
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
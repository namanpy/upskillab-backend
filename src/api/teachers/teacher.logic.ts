import { Injectable, NotFoundException } from '@nestjs/common';
import { TeacherDataService } from './teacher.data';
import { CreateTeacherDto, GetTeacherRequestDTO } from '../../dto/teacher.dto';
import { GetTeachersResponseDTO } from '../../dto/teacher.dto';
// import { TeacherDocument } from '../../schemas/teacher.schema';

@Injectable()
export class TeacherLogicService {
  constructor(private teacherDataService: TeacherDataService) {}

  async getTeachers(
    input: GetTeacherRequestDTO,
  ): Promise<GetTeachersResponseDTO> {
    const teachers = await this.teacherDataService.getTeachers(input);
    return {
      teachers: teachers.map((teacher) => ({
        _id: teacher._id,
        user: teacher.user ? (teacher.user as any)._id.toString() : null,
        qualification: teacher.qualification,
        expertise: teacher.expertise,
        social_links: teacher.social_links,
        bio: teacher.bio,
        experience: teacher.experience,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
      })),
    };
  }

  async createTeacher(createTeacherDto: CreateTeacherDto) {
    const teacher =
      await this.teacherDataService.createTeacher(createTeacherDto);
    return {
      teacher: {
        _id: teacher._id.toString(),
        user: teacher.user ? (teacher.user as any)._id.toString() : null,
        qualification: teacher.qualification,
        expertise: teacher.expertise,
        social_links: teacher.social_links,
        bio: teacher.bio,
        experience: teacher.experience,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
      },
    };
  }

  async getTeacherById(id: string) {
    const teacher = await this.teacherDataService.getTeacherById(id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return {
      teacher: {
        _id: teacher._id.toString(),
        user: teacher.user ? (teacher.user as any)._id.toString() : null,
        qualification: teacher.qualification,
        expertise: teacher.expertise,
        social_links: teacher.social_links,
        bio: teacher.bio,
        experience: teacher.experience,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
      },
    };
  }

  async updateTeacher(id: string, updateTeacherDto: Partial<CreateTeacherDto>) {
    const teacher = await this.teacherDataService.updateTeacher(
      id,
      updateTeacherDto,
    );
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return {
      teacher: {
        _id: teacher._id.toString(),
        user: teacher.user ? (teacher.user as any)._id.toString() : null,
        qualification: teacher.qualification,
        expertise: teacher.expertise,
        social_links: teacher.social_links,
        bio: teacher.bio,
        experience: teacher.experience,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
      },
    };
  }

  async deleteTeacher(id: string) {
    const teacher = await this.teacherDataService.deleteTeacher(id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return { message: 'Teacher deleted successfully' };
  }
}

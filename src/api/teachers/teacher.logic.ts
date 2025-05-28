
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TeacherDataService } from './teacher.data';
import { CreateTeacherDto, GetTeacherRequestDTO, TeacherDetailsResponseDTO, UpdateTeacherDetailsDTO } from '../../dto/teacher.dto';
import { GetTeachersResponseDTO } from '../../dto/teacher.dto';
import { UserDocument } from '../../schemas/user.schema';
import { USER_TYPES } from '../../common/constants/user.constants';

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
        name: teacher.name,
        qualification: teacher.qualification,
        expertise: teacher.expertise,
        social_links: teacher.social_links,
        bio: teacher.bio,
        image: teacher.image,
        experience: teacher.experience,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
      })),
    };
  }

  async createTeacher(createTeacherDto: CreateTeacherDto) {

    const teacher =
      await this.teacherDataService.createTeacher(createTeacherDto);
      console.log(teacher,"2")
    return {
      teacher: {
        _id: teacher._id.toString(),
        user: teacher.user ? (teacher.user as any)._id.toString() : null,
        qualification: teacher.qualification,
        expertise: teacher.expertise,
        social_links: teacher.social_links,
        bio: teacher.bio,
        experience: teacher.experience,
        image: teacher.image,
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
        user: teacher.user ? (teacher.user as UserDocument)._id.toString() : null,
        name: teacher.name,
        qualification: teacher.qualification,
        expertise: teacher.expertise,
        social_links: teacher.social_links,
        bio: teacher.bio,
        image: teacher.image,
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
        name: teacher.name,
        qualification: teacher.qualification,
        expertise: teacher.expertise,
        social_links: teacher.social_links,
        bio: teacher.bio,
        image: teacher.image,
        experience: teacher.experience,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
      },
    };
  }

  async getTeacherDetails(user: any): Promise<TeacherDetailsResponseDTO> {
    // Verify user is a teacher
    if (user.userType !== USER_TYPES.TEACHER) {
      throw new UnauthorizedException('Only teachers can access this endpoint');
    }

    const teacher = await this.teacherDataService.getTeacherByUserId(user._id);
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    // Since getTeacherByUserId ensures teacher.user is not null, we can safely cast
    const userDoc = teacher.user as UserDocument;

    return {
      _id: teacher._id,
      name: teacher.name,
      email: userDoc.email,
      mobileNumber: userDoc.mobileNumber,
      qualification: teacher.qualification,
      expertise: teacher.expertise,
      social_links: teacher.social_links,
      bio: teacher.bio,
      image: teacher.image,
      experience: teacher.experience,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    };
  }

  async updateTeacherDetails(user: any, updateTeacherDto: UpdateTeacherDetailsDTO): Promise<TeacherDetailsResponseDTO> {
    // Verify user is a teacher
    if (user.userType !== USER_TYPES.TEACHER) {
      throw new UnauthorizedException('Only teachers can access this endpoint');
    }

    const teacher = await this.teacherDataService.updateTeacherByUserId(user._id, updateTeacherDto);
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    // Since updateTeacherByUserId ensures teacher.user is not null, we can safely cast
    const userDoc = teacher.user as UserDocument;

    return {
      _id: teacher._id,
      name: teacher.name,
      email: userDoc.email,
      mobileNumber: userDoc.mobileNumber,
      qualification: teacher.qualification,
      expertise: teacher.expertise,
      social_links: teacher.social_links,
      bio: teacher.bio,
      image: teacher.image,
      experience: teacher.experience,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    };
  }
}
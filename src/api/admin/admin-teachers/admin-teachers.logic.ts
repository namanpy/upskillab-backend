import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminTeachersDataService } from './admin-teachers.data';
import { UpdateTeacherDto, GetTeachersRequestDto, GetTeachersResponseDto, TeacherResponseDto } from '../../../dto/admin/admin-teachers.dto';
import { TeacherDocument } from '../../../schemas/teacher.schema';
import { UserDocument } from '../../../schemas/user.schema';

// @Injectable()
// export class AdminTeachersLogicService {
//   constructor(private adminTeachersDataService: AdminTeachersDataService) {}

//   async getTeachers(input: GetTeachersRequestDto): Promise<GetTeachersResponseDto> {
//     const teachers = await this.adminTeachersDataService.getTeachers(input);
//     return {
//       teachers: teachers.map((teacher: TeacherDocument & { user: UserDocument }) => ({
//         _id: teacher._id,
//         name: teacher.name,
//         email: teacher.user.email,
//         mobileNumber: teacher.user.mobileNumber,
//         isActive: teacher.user.isActive,
//         createdAt: teacher.createdAt,
//         updatedAt: teacher.updatedAt,
//       })),
//     };
//   }

//   async updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto): Promise<TeacherResponseDto> {
//     const teacher = await this.adminTeachersDataService.updateTeacher(id, updateTeacherDto);
//     if (!teacher) {
//       throw new NotFoundException(`Teacher with ID ${id} not found`);
//     }
//     const user = teacher.user as unknown as UserDocument; // Proper type assertion
//     return {
//       _id: teacher._id,
//       name: teacher.name,
//       email: user.email,
//       mobileNumber: user.mobileNumber,
//       isActive: user.isActive,
//       createdAt: teacher.createdAt,
//       updatedAt: teacher.updatedAt,
//     };
//   }

//   async deleteTeacher(id: string): Promise<{ message: string }> {
//     await this.adminTeachersDataService.deleteTeacher(id);
//     return { message: 'Teacher deleted successfully' };
//   }
// }

@Injectable()
export class AdminTeachersLogicService {
  constructor(private adminTeachersDataService: AdminTeachersDataService) {}

  async getTeachers(input: GetTeachersRequestDto): Promise<GetTeachersResponseDto> {
    const teachers = await this.adminTeachersDataService.getTeachers(input);
    // Filter out teachers with missing user data
    const validTeachers = teachers.filter((teacher: TeacherDocument & { user: UserDocument | null }) => teacher.user !== null);
    
    return {
      teachers: validTeachers.map((teacher: TeacherDocument & { user: UserDocument }) => ({
        _id: teacher._id,
        name: teacher.name,
        image:teacher?.image,
        email: teacher.user?.email ?? 'N/A', // Default value if user is null
        mobileNumber: teacher.user?.mobileNumber ?? 'N/A',
        isActive: teacher.user?.isActive ?? false,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
      })),
    };
  }

  async updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto): Promise<TeacherResponseDto> {
    const teacher = await this.adminTeachersDataService.updateTeacher(id, updateTeacherDto);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    const user = teacher.user as unknown as UserDocument;
    if (!user) {
      throw new NotFoundException(`User for teacher with ID ${id} not found`);
    }
    return {
      _id: teacher._id,
      name: teacher.name,
      image:teacher.image,
      email: user.email,
      mobileNumber: user.mobileNumber,
      isActive: user.isActive,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    };
  }

  async deleteTeacher(id: string): Promise<{ message: string }> {
    await this.adminTeachersDataService.deleteTeacher(id);
    return { message: 'Teacher deleted successfully' };
  }
}
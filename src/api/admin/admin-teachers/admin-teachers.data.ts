import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from '../../../schemas/teacher.schema';
import { User, UserDocument } from '../../../schemas/user.schema';
import { UpdateTeacherDto, GetTeachersRequestDto } from '../../../dto/admin/admin-teachers.dto';

@Injectable()
export class AdminTeachersDataService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getTeachers(input: GetTeachersRequestDto): Promise<TeacherDocument[]> {
    const { search, skip = 0, limit = 0 } = input;
    return this.teacherModel
      .find({
        ...(search ? { name: { $regex: search, $options: 'i' } } : {}),
      })
      .skip(skip)
      .limit(limit)
      .populate('user')
      .exec();
  }

  async updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto): Promise<TeacherDocument | null> { // Changed return type
    // Fetch the teacher record
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    // Fetch the associated user record
    const user = await this.userModel.findById(teacher.user).exec();
    if (!user) {
      throw new BadRequestException(`User with ID ${teacher.user} not found`);
    }

    // Update user fields if provided
    if (updateTeacherDto.email || updateTeacherDto.mobileNumber || updateTeacherDto.isActive !== undefined) {
      const userData = {
        ...(updateTeacherDto.email && { email: updateTeacherDto.email }),
        ...(updateTeacherDto.mobileNumber && { mobileNumber: updateTeacherDto.mobileNumber }),
        ...(updateTeacherDto.isActive !== undefined && { isActive: updateTeacherDto.isActive }),
      };

      const updatedUser = await this.userModel.findByIdAndUpdate(
        teacher.user,
        userData,
        { new: true },
      ).exec();
      if (!updatedUser) {
        throw new BadRequestException('Failed to update user for teacher');
      }
    }

    // Update teacher fields if provided
    const teacherData = {
      ...(updateTeacherDto.name && { name: updateTeacherDto.name }),
    };

    return this.teacherModel
      .findByIdAndUpdate(id, teacherData, { new: true })
      .populate('user')
      .exec();
  }

  async deleteTeacher(id: string): Promise<void> {
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    // Delete the associated user
    await this.userModel.findByIdAndDelete(teacher.user).exec();
    // Delete the teacher
    await this.teacherModel.findByIdAndDelete(id).exec();
  }
}
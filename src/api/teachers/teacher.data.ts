import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from '../../schemas/teacher.schema';
import { CreateTeacherDto } from '../../dto/teacher.dto';
import { User } from '../../schemas/user.schema';

@Injectable()
export class TeacherDataService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getTeachers(): Promise<TeacherDocument[]> {
    return this.teacherModel.find().populate('user').exec();
  }

  async createTeacher(createTeacherDto: CreateTeacherDto): Promise<TeacherDocument> {
    // Validate user exists
    const user = await this.userModel.findById(createTeacherDto.user).exec();
    if (!user) {
      throw new BadRequestException(`User with ID ${createTeacherDto.user} not found`);
    }

    const newTeacher = new this.teacherModel(createTeacherDto);
    return newTeacher.save();
  }

  async getTeacherById(id: string): Promise<TeacherDocument | null> {
    return this.teacherModel.findById(id).populate('user').exec();
  }

  async updateTeacher(
    id: string,
    updateTeacherDto: Partial<CreateTeacherDto>,
  ): Promise<TeacherDocument | null> {
    if (updateTeacherDto.user) {
      const user = await this.userModel.findById(updateTeacherDto.user).exec();
      if (!user) {
        throw new BadRequestException(`User with ID ${updateTeacherDto.user} not found`);
      }
    }

    return this.teacherModel
      .findByIdAndUpdate(id, updateTeacherDto, { new: true })
      .populate('user')
      .exec();
  }

  async deleteTeacher(id: string): Promise<TeacherDocument | null> {
    return this.teacherModel.findByIdAndDelete(id).exec();
  }
}
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from '../../schemas/teacher.schema';
import { CreateTeacherDto, GetTeacherRequestDTO } from '../../dto/teacher.dto';
import { User, UserDocument } from '../../schemas/user.schema';
import { USER_TYPES } from '../../common/constants/user.constants';

// Custom type to handle populated user field
type PopulatedTeacherDocument = Omit<TeacherDocument, 'user'> & { user: UserDocument | null };

@Injectable()
export class TeacherDataService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getTeachers(input: GetTeacherRequestDTO) {
    const { search, skip = 0, limit = 0 } = input;
    // Fetch teachers and populate user
    const teachers = await this.teacherModel
      .find({
        ...(search ? { name: { $regex: search, $options: 'i' } } : {}),
      })
      .skip(skip)
      .limit(limit)
      .populate<{ user: UserDocument | null }>('user')
      .exec();

    // Filter teachers where user.isActive is true
    return teachers.filter((teacher) => teacher.user?.isActive === true);
  }

  async createTeacher(
    createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherDocument> {
    // Step 1: Create a new User record with userType as TEACHER and isActive as false
    const userData = {
      email: createTeacherDto.email,
      mobileNumber: createTeacherDto.mobileNumber,
      userType: USER_TYPES.TEACHER, // Automatically set to TEACHER
      isActive: false, // Default to false
    };

    const newUser = new this.userModel(userData);
    const savedUser = await newUser.save();

    if (!savedUser) {
      throw new BadRequestException('Failed to create user for teacher');
    }

    // Step 2: Create Teacher record with the newly created User ID
    const teacherData = {
      name: createTeacherDto.name,
      user: savedUser._id, // Reference the newly created user
      qualification: createTeacherDto.qualification,
      expertise: createTeacherDto.expertise,
      social_links: createTeacherDto.social_links || {},
      bio: createTeacherDto.bio,
      experience: createTeacherDto.experience,
    };

    const newTeacher = new this.teacherModel(teacherData);
    return newTeacher.save();
  }

  async getTeacherById(id: string): Promise<PopulatedTeacherDocument | null> {
    const teacher = await this.teacherModel
      .findById(id)
      .populate<{ user: UserDocument | null }>('user')
      .exec();
    // Return null if teacher not found or user.isActive is not true
    if (!teacher || !teacher.user || teacher.user.isActive !== true) {
      return null;
    }
    return teacher as PopulatedTeacherDocument;
  }

  async updateTeacher(
    id: string,
    updateTeacherDto: Partial<CreateTeacherDto>,
  ): Promise<TeacherDocument | null> {
    // Fetch the teacher record without populating user initially
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) {
      throw new BadRequestException(`Teacher with ID ${id} not found`);
    }

    // Fetch the associated user record
    const user = await this.userModel.findById(teacher.user).exec();
    if (!user) {
      throw new BadRequestException(`User with ID ${teacher.user} not found`);
    }

    // If user-related fields are updated, update the user record
    if (updateTeacherDto.email || updateTeacherDto.mobileNumber) {
      const userData = {
        email: updateTeacherDto.email || user.email,
        mobileNumber: updateTeacherDto.mobileNumber || user.mobileNumber,
        userType: USER_TYPES.TEACHER,
        isActive: user.isActive, // Preserve isActive status
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

    // Update teacher fields
    const teacherData = {
      name: updateTeacherDto.name,
      qualification: updateTeacherDto.qualification,
      expertise: updateTeacherDto.expertise,
      social_links: updateTeacherDto.social_links,
      bio: updateTeacherDto.bio,
      experience: updateTeacherDto.experience,
    };

    return this.teacherModel
      .findByIdAndUpdate(id, teacherData, { new: true })
      .populate('user')
      .exec();
  }
}
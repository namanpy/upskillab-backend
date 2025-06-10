import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { StudentDataService } from './student.data';
import { ImageUploaderService } from '../../common/services/image-uploader.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { OrderDataService } from '../order/order.data';
import { StudentDTO, UpdateStudentDTO } from '../../dto/student.dto';
import { USER_TYPES } from '../../common/constants/user.constants';

@Injectable()
export class StudentLogicService {
  constructor(
    private studentDataService: StudentDataService,
    private imageUploaderService: ImageUploaderService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private orderDataService: OrderDataService,
  ) {}

 async getStudentDetails(user: any): Promise<StudentDTO> {
  if (user.userType !== USER_TYPES.STUDENT) {
    throw new ForbiddenException('Only students can access their details');
  }

  let student = await this.studentDataService.getStudentByUserId(user._id);

  // ✅ Create default profile if not found
  if (!student) {
    const defaultStudent = {
      user: user._id,
      fullName: 'N/A',
      studentType: 'REGULAR', // or whatever default type you want from STUDENT_TYPE
    };
    student = await this.studentDataService.createStudent(defaultStudent as any);
  }

  const userDoc = await this.userModel.findById(user._id).lean().exec();
  const orders = await this.orderDataService.getOrdersByUser(user._id);
  const latestOrder = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const mobileNumber = latestOrder ? latestOrder.mobileNumber : undefined;

  return {
    _id: student._id.toString(),
    fullName: student.fullName,
    college: student.college,
    studentType: student.studentType,
    image: student.image,
    bio: student.bio,
    skills: student.skills,
    email: userDoc?.email,
    mobileNumber,
  };
}

  async updateStudentDetails(user: any, updateDto: UpdateStudentDTO, file?: Express.Multer.File): Promise<StudentDTO> {
    if (user.userType !== USER_TYPES.STUDENT) {
      throw new ForbiddenException('Only students can update their details');
    }

    const student = await this.studentDataService.getStudentByUserId(user._id);
    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // Handle image upload
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.imageUploaderService.uploadImage(file, 'student', user._id);
    }

    // Update student data
    const studentUpdate: Partial<Omit<StudentDTO, '_id'>> = {
      fullName: updateDto.fullName,
      college: updateDto.college,
      studentType: updateDto.studentType,
      bio: updateDto.bio,
      skills: updateDto.skills,
      image: imageUrl || student.image,
    };

    const updatedStudent = await this.studentDataService.updateStudent(user._id, studentUpdate);
    if (!updatedStudent) {
      throw new NotFoundException('Failed to update student profile');
    }

    // Update email in User schema
    if (updateDto.email) {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(user._id, { email: updateDto.email }, { new: true })
        .lean()
        .exec();
      if (!updatedUser) {
        throw new NotFoundException('Failed to update user email');
      }
    }

    // Update mobileNumber in Order schema
    let mobileNumber: string | undefined;
    if (updateDto.mobileNumber) {
      const orders = await this.orderDataService.getOrdersByUser(user._id);
      if (orders.length > 0) {
        // Update latest order
        const latestOrder = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        const updatedOrder = await this.orderDataService.updateOrder(latestOrder._id.toString(), {
          mobileNumber: updateDto.mobileNumber,
        });
        mobileNumber = updatedOrder?.mobileNumber;
      } else {
        throw new BadRequestException('No orders found to update mobile number');
      }
    } else {
      const orders = await this.orderDataService.getOrdersByUser(user._id);
      const latestOrder = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      mobileNumber = latestOrder ? latestOrder.mobileNumber : undefined;
    }

    return {
      _id: updatedStudent._id.toString(),
      fullName: updatedStudent.fullName,
      college: updatedStudent.college,
      studentType: updatedStudent.studentType,
      image: updatedStudent.image,
      bio: updatedStudent.bio,
      skills: updatedStudent.skills,
      email: updateDto.email || (await this.userModel.findById(user._id).lean().exec())?.email,
      mobileNumber,
    };
  }
}
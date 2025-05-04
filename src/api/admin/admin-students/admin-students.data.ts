import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../schemas/user.schema';
import { Student, StudentDocument } from '../../../schemas/student.schema';
import { Order, OrderDocument } from '../../../schemas/order.schema';
import { Batch, BatchDocument } from '../../../schemas/course/batch.schema';
import { UpdateStudentDto } from './admin-students.dto';
import { USER_TYPES } from '../../../common/constants/user.constants';

// Define a custom type for orders with batch details
type EnrichedOrder = OrderDocument & { batchDetails?: BatchDocument };

@Injectable()
export class AdminStudentsDataService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
  ) {}

  async getStudents(): Promise<
    Array<{
      user: UserDocument;
      student: StudentDocument;
      orders: EnrichedOrder[];
    }>
  > {
    // Fetch students from Student table
    const students = await this.studentModel.find().exec();

    // Fetch corresponding User and Order data
    const studentData = await Promise.all(
      students.map(async (student) => {
        const user = await this.userModel
          .findOne({
            _id: student.user,
            userType: USER_TYPES.STUDENT,
          })
          .exec();

        if (!user) {
          return null; // Skip if user not found or not a student
        }

        const orders = await this.orderModel.find({ user: user._id }).exec();

        // Fetch batch details for each order
        const enrichedOrders: EnrichedOrder[] = await Promise.all(
          orders.map(async (order: OrderDocument) => {
            const batch = await this.batchModel.findById(order.batch).exec();
            return Object.assign(order, { batchDetails: batch || undefined });
          }),
        );

        return {
          user,
          student,
          orders: enrichedOrders,
        };
      }),
    );

    // Filter out null entries (where user was not found)
    return studentData.filter((data) => data !== null);
  }

  async getOrdersByUserId(userId: string): Promise<EnrichedOrder[]> {
    const orders = await this.orderModel.find({ user: userId }).exec();

    // Fetch batch details for each order
    const enrichedOrders: EnrichedOrder[] = await Promise.all(
      orders.map(async (order: OrderDocument) => {
        const batch = await this.batchModel.findById(order.batch).exec();
        return Object.assign(order, { batchDetails: batch || undefined });
      }),
    );

    return enrichedOrders;
  }

  async updateStudent(studentId: string, updateStudentDto: UpdateStudentDto): Promise<{
    user: UserDocument;
    student: StudentDocument;
  }> {
    // Find the student
    const student = await this.studentModel.findById(studentId).exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Find the associated user
    const user = await this.userModel
      .findOne({
        _id: student.user,
        userType: USER_TYPES.STUDENT,
      })
      .exec();
    if (!user) {
      throw new NotFoundException(`User for student with ID ${studentId} not found`);
    }

    // Update user fields if provided
    if (
      updateStudentDto.email ||
      updateStudentDto.mobileNumber ||
      updateStudentDto.isActive !== undefined
    ) {
      const userData = {
        ...(updateStudentDto.email && { email: updateStudentDto.email }),
        ...(updateStudentDto.mobileNumber && {
          mobileNumber: updateStudentDto.mobileNumber,
        }),
        ...(updateStudentDto.isActive !== undefined && {
          isActive: updateStudentDto.isActive,
        }),
      };

      const updatedUser = await this.userModel
        .findByIdAndUpdate(user._id, userData, { new: true })
        .exec();
      if (!updatedUser) {
        throw new BadRequestException('Failed to update user for student');
      }
    }

    // Update student fields if provided
    let updatedStudent: StudentDocument | null = student;
    if (updateStudentDto.fullName) {
      updatedStudent = await this.studentModel
        .findByIdAndUpdate(
          studentId,
          { fullName: updateStudentDto.fullName },
          { new: true },
        )
        .exec();
      if (!updatedStudent) {
        throw new BadRequestException('Failed to update student');
      }
    }

    // Fetch the updated user
    const finalUser = await this.userModel.findById(user._id).exec();
    if (!finalUser) {
      throw new NotFoundException('User not found after update');
    }

    return {
      user: finalUser,
      student: updatedStudent,
    };
  }

  async deleteStudent(studentId: string): Promise<void> {
    // Find the student
    const student = await this.studentModel.findById(studentId).exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Find the associated user
    const user = await this.userModel
      .findOne({
        _id: student.user,
        userType: USER_TYPES.STUDENT,
      })
      .exec();
    if (!user) {
      throw new NotFoundException(`User for student with ID ${studentId} not found`);
    }

    // Delete associated orders
    await this.orderModel.deleteMany({ user: user._id }).exec();

    // Delete the user
    await this.userModel.findByIdAndDelete(user._id).exec();

    // Delete the student
    await this.studentModel.findByIdAndDelete(studentId).exec();
  }
}
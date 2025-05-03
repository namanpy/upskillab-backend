// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import {
//   Enrollment,
//   EnrollmentDocument,
// } from '../../schemas/enrollment.schema';
// import {
//   CreateEnrollmentDto,
//   UpdateEnrollmentDto,
// } from '../../dto/enrollment.dto';
// import { User } from 'src/schemas/user.schema';
// import { Course } from 'src/schemas/course/course.schema';
// import { Batch } from 'src/schemas/course/batch.schema';
// import { Order } from 'src/schemas/order.schema';

// @Injectable()
// export class EnrollmentDataService {
//   constructor(
//     @InjectModel(Enrollment.name)
//     private enrollmentModel: Model<EnrollmentDocument>,
//   ) {}

//   async getEnrollments(): Promise<EnrollmentDocument[]> {
//     return this.enrollmentModel
//       .find()
//       .populate('userId')
//       .populate('courseId')
//       .populate('batchId')
//       .populate('orderId')
//       .exec();
//   }

//   async getEnrollmentsByUser(userId: string): Promise<EnrollmentDocument[]> {
//     return this.enrollmentModel
//       .find({ userId })
//       .populate('userId')
//       .populate('courseId')
//       .populate('batchId')
//       .populate('orderId')
//       .exec();
//   }

//   async createEnrollment(
//     createEnrollmentDto: CreateEnrollmentDto,
//   ): Promise<EnrollmentDocument> {
//     const newEnrollment = new this.enrollmentModel(createEnrollmentDto);
//     return newEnrollment.save();
//   }

//   async getEnrollmentById(id: string): Promise<EnrollmentDocument | null> {
//     return this.enrollmentModel
//       .findById(id)
//       .populate('userId')
//       .populate('courseId')
//       .populate('batchId')
//       .populate('orderId')
//       .exec();
//   }

//   async updateEnrollment(
//     id: string,
//     updateEnrollmentDto: UpdateEnrollmentDto,
//   ): Promise<EnrollmentDocument | null> {
//     return this.enrollmentModel
//       .findByIdAndUpdate(id, updateEnrollmentDto, { new: true })
//       .populate('userId')
//       .populate('courseId')
//       .populate('batchId')
//       .populate('orderId')
//       .exec();
//   }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../../schemas/order.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { Student, StudentDocument } from '../../schemas/student.schema';
import { ORDER_STATUS } from 'src/common/constants/order.constants';

@Injectable()
export class EnrollmentDataService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async getEnrollmentByUserId(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const student = await this.studentModel.findOne({ user: userId }).exec();
    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const order = await this.orderModel
      .find({ user: userId, status: ORDER_STATUS.COMPLETED.code })
      .populate('batch')
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found for this user');
    }

    return { user, student, order };
  }
  // async deleteEnrollment(id: string): Promise<EnrollmentDocument | null> {
  //   return this.enrollmentModel.findByIdAndDelete(id).exec();
  // }
  // async getEnrollmentsByCourseAndUser(
  //   userId: string | Types.ObjectId,
  //   courseId: string | Types.ObjectId,
  // ) {
  //   return this.enrollmentModel
  //     .findOne({ userId, courseId })
  //     .populate<{ userId: User }>('userId')
  //     .populate<{ courseId: Course }>('courseId')
  //     .populate<{ batchId: Batch }>('batchId')
  //     .populate<{ orderId: Order }>('orderId')
  //     .exec();
  // }
}
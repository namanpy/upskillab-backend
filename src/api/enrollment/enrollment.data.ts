import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../../schemas/order.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { Student, StudentDocument } from '../../schemas/student.schema';
import { ORDER_STATUS } from 'src/common/constants/order.constants';
import { Batch } from 'src/schemas/course/batch.schema';

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
      .populate<{ batch: Batch}>('batch')
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found for this user');
    }

    return { user, student, order };
  }
  // async deleteEnrollment(id: string): Promise<EnrollmentDocument | null> {
  //   return this.enrollmentModel.findByIdAndDelete(id).exec();
  // }
  async getEnrollmentByCourseAndUser(
    userId: string | Types.ObjectId,
    courseId: string | Types.ObjectId,
  ): Promise<Order & { batchDetails: Batch }> {
    return this.orderModel
      .aggregate([
        {
          $match: {
            user: new Types.ObjectId(userId),
            status: ORDER_STATUS.COMPLETED.code,
          },
        },
        {
          $lookup: {
            from: 'batches',
            localField: 'batch',
            foreignField: '_id',
            as: 'batchDetails',
          },
        },
        {
          $unwind: '$batchDetails',
        },
        {
          $match: {
            'batchDetails.course': new Types.ObjectId(courseId),
          },
        },
      ])
      .then((a) => a.at(0));
  }
}

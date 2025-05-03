import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Enrollment,
  EnrollmentDocument,
} from '../../schemas/enrollment.schema';
import {
  CreateEnrollmentDto,
  UpdateEnrollmentDto,
} from '../../dto/enrollment.dto';
import { User } from 'src/schemas/user.schema';
import { Course } from 'src/schemas/course/course.schema';
import { Batch } from 'src/schemas/course/batch.schema';
import { Order } from 'src/schemas/order.schema';

@Injectable()
export class EnrollmentDataService {
  constructor(
    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async getEnrollments(): Promise<EnrollmentDocument[]> {
    return this.enrollmentModel
      .find()
      .populate('userId')
      .populate('courseId')
      .populate('batchId')
      .populate('orderId')
      .exec();
  }

  async getEnrollmentsByUser(userId: string): Promise<EnrollmentDocument[]> {
    return this.enrollmentModel
      .find({ userId })
      .populate('userId')
      .populate('courseId')
      .populate('batchId')
      .populate('orderId')
      .exec();
  }

  async createEnrollment(
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentDocument> {
    const newEnrollment = new this.enrollmentModel(createEnrollmentDto);
    return newEnrollment.save();
  }

  async getEnrollmentById(id: string): Promise<EnrollmentDocument | null> {
    return this.enrollmentModel
      .findById(id)
      .populate('userId')
      .populate('courseId')
      .populate('batchId')
      .populate('orderId')
      .exec();
  }

  async updateEnrollment(
    id: string,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<EnrollmentDocument | null> {
    return this.enrollmentModel
      .findByIdAndUpdate(id, updateEnrollmentDto, { new: true })
      .populate('userId')
      .populate('courseId')
      .populate('batchId')
      .populate('orderId')
      .exec();
  }

  async deleteEnrollment(id: string): Promise<EnrollmentDocument | null> {
    return this.enrollmentModel.findByIdAndDelete(id).exec();
  }
  async getEnrollmentsByCourseAndUser(
    userId: string | Types.ObjectId,
    courseId: string | Types.ObjectId,
  ) {
    return this.enrollmentModel
      .findOne({ userId, courseId })
      .populate<{ userId: User }>('userId')
      .populate<{ courseId: Course }>('courseId')
      .populate<{ batchId: Batch }>('batchId')
      .populate<{ orderId: Order }>('orderId')
      .exec();
  }
}

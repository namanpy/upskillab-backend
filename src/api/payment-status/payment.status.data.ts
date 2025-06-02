import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from '../../schemas/payment.schema';
import { USER_TYPES } from '../../common/constants/user.constants';

@Injectable()
export class PaymentStatusDataService {
  constructor(
    @InjectModel('Payment') private paymentModel: Model<Payment>,
    @InjectModel('Student') private studentModel: Model<any>,
  ) {}

  async getPaymentsByUser(userId: string): Promise<any[]> {
    console.log('getPaymentsByUser: Fetching for user:', userId);
    const payments = await this.paymentModel
      .find({ user: userId })
      .populate({
        path: 'order',
        select: '_id user totalAmount amountPaid status batch createdAt updatedAt',
        populate: [
          {
            path: 'user',
            select: '_id email username isActive mobileNumber userType',
          },
          {
            path: 'batch',
            select: '_id batchCode course startTime startDate totalSeats remainingSeats duration teacher imageUrl active createdAt updatedAt',
            populate: {
              path: 'course',
              select: '_id courseName courseCode courseImage courseMode courseDuration originalPrice discountedPrice youtubeUrl brochure courseLevel certificate active faqs shortDescription tags programDetails targetAudience featured courseRating certifierLogo',
            },
          },
        ],
      })
      .exec();

    // Fetch student details
    return await Promise.all(
      payments.map(async (payment) => {
        const student = await this.studentModel
          .findOne({ user: payment.user })
          .select('fullName studentType image')
          .exec();
        return { ...payment.toObject(), student };
      }),
    );
  }

  async getAllPayments(): Promise<any[]> {
    console.log('getAllPayments: Fetching all student payments');
    const payments = await this.paymentModel
      .find()
      .populate({
        path: 'order',
        select: '_id user totalAmount amountPaid status batch createdAt updatedAt',
        populate: [
          {
            path: 'user',
            match: { userType: USER_TYPES.STUDENT },
            select: '_id email username isActive mobileNumber userType',
          },
          {
            path: 'batch',
            select: '_id batchCode course startTime startDate totalSeats remainingSeats duration teacher imageUrl active createdAt updatedAt',
            populate: {
              path: 'course',
              select: '_id courseName courseCode courseImage courseMode courseDuration originalPrice discountedPrice youtubeUrl brochure courseLevel certificate active faqs shortDescription tags programDetails targetAudience featured courseRating certifierLogo',
            },
          },
        ],
      })
      .exec();

    // Fetch student details
    return await Promise.all(
      payments.map(async (payment) => {
        const student = await this.studentModel
          .findOne({ user: payment.user })
          .select('fullName studentType image')
          .exec();
        return { ...payment.toObject(), student };
      }),
    );
  }
}
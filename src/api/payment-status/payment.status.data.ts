import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment } from '../../schemas/payment.schema';
import { USER_TYPES } from '../../common/constants/user.constants';

// Interface for Student document
interface Student {
  user: Types.ObjectId;
  fullName: string;
  studentType: string;
  image: string;
  skills: string[];
}

// Interface for response shape
interface PaymentWithDetails {
  _id: string;
  user: string;
  order: any;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  status: string;
  paymentMode: string; // Changed to optional or handle undefined
  createdAt: Date;
  updatedAt: Date;
  student: {
    fullName: string;
    studentType: string;
    image: string;
  } | null;
  totalPaid: number;
}

@Injectable()
export class PaymentStatusDataService {
  constructor(
    @InjectModel('Payment') private paymentModel: Model<Payment>,
    @InjectModel('Student') private studentModel: Model<Student>,
  ) {}

  async getPaymentsByUser(userId: string): Promise<PaymentWithDetails[]> {
    console.log('getPaymentsByUser: Fetching for user:', userId);

    // Fetch payments
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
            select: '_id batchCode course startTime startDate totalSeats remainingSeats Duration teacher imageUrl active createdAt updatedAt',
            populate: {
              path: 'course',
              select: '_id courseName courseCode courseImage courseMode courseDuration originalPrice discountedPrice youtubeUrl brochure courseLevel certificate active faqs shortDescription tags programDetails targetAudience featured courseRating certifierLogo',
            },
          },
        ],
      })
      .lean()
      .exec();

    // Fetch student details
    const student = await this.studentModel
      .findOne({ user: userId })
      .select('fullName studentType image')
      .lean()
      .exec();

    // Calculate totalPaid
    const totalPaid = await this.paymentModel
      .aggregate([
        { $match: { user: new Types.ObjectId(userId), status: 'COMPLETED' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ])
      .exec();

    const totalPaidAmount = totalPaid.length > 0 ? totalPaid[0].total : 0;

    // Attach student and totalPaid to each payment
    return payments.map(payment => ({
      ...payment,
      _id: payment._id.toString(), // Convert ObjectId to string
      user: payment.user?.toString() || '', // Handle undefined user
      paymentMode: payment.paymentMode || '', // Handle undefined paymentMode
      student: student
        ? {
            fullName: student.fullName,
            studentType: student.studentType,
            image: student.image || '',
          }
        : null,
      totalPaid: totalPaidAmount,
    }));
  }

  async getAllPayments(): Promise<PaymentWithDetails[]> {
    console.log('getAllPayments: Fetching all student payments');

    // Fetch payments
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
            select: '_id batchCode course startTime startDate totalSeats remainingSeats Duration teacher imageUrl active createdAt updatedAt',
            populate: {
              path: 'course',
              select: '_id courseName courseCode courseImage courseMode courseDuration originalPrice discountedPrice youtubeUrl brochure courseLevel certificate active faqs shortDescription tags programDetails targetAudience featured courseRating',
            },
          },
        ],
      })
      .lean()
      .exec();

    // Group payments by user
    const paymentsByUser = payments.reduce((acc: { [key: string]: any[] }, payment) => {
      const userId = payment.user?.toString();
      if (userId) {
        if (!acc[userId]) acc[userId] = [];
        acc[userId].push(payment);
      }
      return acc;
    }, {});

    // Define result array
    const result: PaymentWithDetails[] = [];

    // Fetch student details and totalPaid for each user
    for (const userId of Object.keys(paymentsByUser)) {
      const student = await this.studentModel
        .findOne({ user: userId })
        .select('fullName studentType image')
        .lean()
        .exec();

      const totalPaid = await this.paymentModel
        .aggregate([
          { $match: { user: new Types.ObjectId(userId), status: 'COMPLETED' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ])
        .exec();

      const totalPaidAmount = totalPaid.length > 0 ? totalPaid[0].total : 0;

      paymentsByUser[userId].forEach(payment => {
        result.push({
          ...payment,
          _id: payment._id.toString(), // Convert ObjectId to string
          user: payment.user?.toString() || '', // Handle undefined user
          paymentMode: payment.paymentMode || '', // Handle undefined paymentMode
          student: student
            ? {
                fullName: student.fullName,
                studentType: student.studentType,
                image: student.image || '',
              }
            : null,
          totalPaid: totalPaidAmount,
        });
      });
    }

    return result;
  }
}
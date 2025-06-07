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
  paymentMode: string;
  createdAt: Date;
  updatedAt: Date;
  student: {
    fullName: string;
    studentType: string;
    image: string;
  } | null;
  totalPaid: number;
}

interface PaymentResult {
  payments: PaymentWithDetails[];
  grandTotal: number;
}

@Injectable()
export class PaymentStatusDataService {
  constructor(
    @InjectModel('Payment') private paymentModel: Model<Payment>,
    @InjectModel('Student') private studentModel: Model<Student>,
  ) {}

  async getPaymentsByUser(userId: string): Promise<PaymentResult> {
    console.log('=== CORRECT APPROACH getPaymentsByUser ===');
    console.log('Input userId:', userId);

    try {
      if (!Types.ObjectId.isValid(userId)) {
        console.log('❌ Invalid ObjectId format');
        return { payments: [], grandTotal: 0 };
      }

      const objectId = new Types.ObjectId(userId);
      console.log('✅ Valid ObjectId:', objectId);

      // CORRECT APPROACH: Use aggregation pipeline to get user's payments
      const payments = await this.paymentModel.aggregate([
        // Step 1: Lookup order details
        {
          $lookup: {
            from: 'orders',
            localField: 'order',
            foreignField: '_id',
            as: 'orderData'
          }
        },
        // Step 2: Filter by user
        {
          $match: {
            'orderData.user': objectId
          }
        },
        // Step 3: Unwind order data
        {
          $unwind: '$orderData'
        },
        // Step 4: Lookup user details
        {
          $lookup: {
            from: 'users',
            localField: 'orderData.user',
            foreignField: '_id',
            as: 'userData'
          }
        },
        // Step 5: Lookup batch details
        {
          $lookup: {
            from: 'batches',
            localField: 'orderData.batch',
            foreignField: '_id',
            as: 'batchData'
          }
        },
        // Step 6: Lookup course details
        {
          $lookup: {
            from: 'courses',
            localField: 'batchData.course',
            foreignField: '_id',
            as: 'courseData'
          }
        }
      ]).exec();

      console.log('📊 Aggregated payments found:', payments.length);

      if (payments.length === 0) {
        console.log('❌ No payments found for user through aggregation');
        return { payments: [], grandTotal: 0 };
      }

      // Fetch student details
      const student = await this.studentModel
        .findOne({ user: objectId })
        .select('fullName studentType image')
        .lean()
        .exec();

      console.log('👨‍🎓 Student found:', !!student);

      // Calculate grand total from COMPLETED orders using aggregation
      const grandTotalAggregation = await this.paymentModel.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: 'order',
            foreignField: '_id',
            as: 'orderData'
          }
        },
        {
          $match: {
            'orderData.user': objectId,
            'orderData.status': 'COMPLETED' // Only sum amountPaid from COMPLETED orders
          }
        },
        {
          $unwind: '$orderData'
        },
        {
          $group: {
            _id: null,
            grandTotal: { $sum: '$orderData.amountPaid' } // Sum the amountPaid field
          }
        }
      ]).exec();

      const grandTotal = grandTotalAggregation.length > 0 ? grandTotalAggregation[0].grandTotal : 0;
      console.log('💰 Grand Total (amountPaid from COMPLETED orders):', grandTotal);

      // Format the payments data
      const result = payments.map(payment => ({
        _id: payment._id.toString(),
        user: payment.userData?.[0]?._id?.toString() || '',
        order: {
          _id: payment.orderData._id.toString(),
          user: payment.userData?.[0] || null,
          totalAmount: payment.orderData.totalAmount || 0,
          amountPaid: payment.orderData.amountPaid || 0,
          status: payment.orderData.status || '',
          batch: {
            _id: payment.batchData?.[0]?._id?.toString() || '',
            batchCode: payment.batchData?.[0]?.batchCode || '',
            course: payment.courseData?.[0] || null,
            startTime: payment.batchData?.[0]?.startTime || '',
            startDate: payment.batchData?.[0]?.startDate || null,
            totalSeats: payment.batchData?.[0]?.totalSeats || 0,
            remainingSeats: payment.batchData?.[0]?.remainingSeats || 0,
            Duration: payment.batchData?.[0]?.Duration || 0,
            teacher: payment.batchData?.[0]?.teacher?.toString() || '',
            imageUrl: payment.batchData?.[0]?.imageUrl || '',
            active: payment.batchData?.[0]?.active ?? false,
            createdAt: payment.batchData?.[0]?.createdAt || null,
            updatedAt: payment.batchData?.[0]?.updatedAt || null,
          },
          createdAt: payment.orderData.createdAt || null,
          updatedAt: payment.orderData.updatedAt || null,
        },
        paymentMethod: payment.paymentMethod || '',
        transactionId: payment.transactionId || '',
        amount: payment.amount || 0,
        status: payment.status || '',
        paymentMode: payment.paymentMode || '',
        createdAt: payment.createdAt || null,
        updatedAt: payment.updatedAt || null,
        student: student
          ? {
              fullName: student.fullName,
              studentType: student.studentType,
              image: student.image || '',
            }
          : null,
        totalPaid: grandTotal, // This will be the same for all payments for this user
      }));

      console.log('✅ Final result length:', result.length);
      console.log('=== END CORRECT APPROACH ===');
      
      return { payments: result, grandTotal };

    } catch (error) {
      console.error('❌ Error in getPaymentsByUser:', error);
      throw error;
    }
  }

  async getAllPayments(): Promise<PaymentResult> {
    console.log('getAllPayments: Fetching all student payments');

    try {
      // Fetch payments using aggregation for better performance
      const payments = await this.paymentModel.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: 'order',
            foreignField: '_id',
            as: 'orderData'
          }
        },
        {
          $unwind: '$orderData'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'orderData.user',
            foreignField: '_id',
            as: 'userData'
          }
        },
        {
          $match: {
            'userData.userType': USER_TYPES.STUDENT
          }
        },
        {
          $lookup: {
            from: 'batches',
            localField: 'orderData.batch',
            foreignField: '_id',
            as: 'batchData'
          }
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'batchData.course',
            foreignField: '_id',
            as: 'courseData'
          }
        }
      ]).exec();

      // Calculate grand total from ALL COMPLETED orders
      const grandTotalAggregation = await this.paymentModel.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: 'order',
            foreignField: '_id',
            as: 'orderData'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'orderData.user',
            foreignField: '_id',
            as: 'userData'
          }
        },
        {
          $match: {
            'orderData.status': 'COMPLETED',
            'userData.userType': USER_TYPES.STUDENT
          }
        },
        {
          $unwind: '$orderData'
        },
        {
          $group: {
            _id: null,
            grandTotal: { $sum: '$orderData.amountPaid' }
          }
        }
      ]).exec();

      const grandTotal = grandTotalAggregation.length > 0 ? grandTotalAggregation[0].grandTotal : 0;
      console.log('💰 Grand Total for all students (COMPLETED orders):', grandTotal);

      // Group payments by user for student details
      const userIds = [...new Set(payments.map(p => p.userData?.[0]?._id?.toString()).filter(Boolean))];
      
      // Fetch all student details in one query
      const students = await this.studentModel
        .find({ user: { $in: userIds.map(id => new Types.ObjectId(id)) } })
        .select('user fullName studentType image')
        .lean()
        .exec();

      const studentMap = students.reduce((acc, student) => {
        acc[student.user.toString()] = student;
        return acc;
      }, {});

      // Format the result
      const result: PaymentWithDetails[] = payments.map(payment => {
        const userId = payment.userData?.[0]?._id?.toString();
        const student = userId ? studentMap[userId] : null;

        return {
          _id: payment._id.toString(),
          user: userId || '',
          order: {
            _id: payment.orderData._id.toString(),
            user: payment.userData?.[0] || null,
            totalAmount: payment.orderData.totalAmount || 0,
            amountPaid: payment.orderData.amountPaid || 0,
            status: payment.orderData.status || '',
            batch: {
              _id: payment.batchData?.[0]?._id?.toString() || '',
              batchCode: payment.batchData?.[0]?.batchCode || '',
              course: payment.courseData?.[0] || null,
            },
            createdAt: payment.orderData.createdAt || null,
            updatedAt: payment.orderData.updatedAt || null,
          },
          paymentMethod: payment.paymentMethod || '',
          transactionId: payment.transactionId || '',
          amount: payment.amount || 0,
          status: payment.status || '',
          paymentMode: payment.paymentMode || '',
          createdAt: payment.createdAt || null,
          updatedAt: payment.updatedAt || null,
          student: student
            ? {
                fullName: student.fullName,
                studentType: student.studentType,
                image: student.image || '',
              }
            : null,
          totalPaid: grandTotal,
        };
      });

      return { payments: result, grandTotal };

    } catch (error) {
      console.error('❌ Error in getAllPayments:', error);
      throw error;
    }
  }
}
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

@Injectable()
export class PaymentStatusDataService {
  constructor(
    @InjectModel('Payment') private paymentModel: Model<Payment>,
    @InjectModel('Student') private studentModel: Model<Student>,
  ) {}

  async getPaymentsByUser(userId: string): Promise<PaymentWithDetails[]> {
    console.log('=== CORRECT APPROACH getPaymentsByUser ===');
    console.log('Input userId:', userId);

    try {
      if (!Types.ObjectId.isValid(userId)) {
        console.log('❌ Invalid ObjectId format');
        return [];
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
        return [];
      }

      // Fetch student details
      const student = await this.studentModel
        .findOne({ user: objectId })
        .select('fullName studentType image')
        .lean()
        .exec();

      console.log('👨‍🎓 Student found:', !!student);

      // Calculate totalPaid - need to use aggregation on orders, not payments
      const totalPaidFromOrders = await this.paymentModel.db.collection('orders')
        .aggregate([
          { 
            $match: { 
              user: objectId,
              status: 'COMPLETED' // or whatever your completed order status is
            } 
          },
          { $group: { _id: null, total: { $sum: '$amountPaid' } } }
        ]).toArray();

      // Also check totalPaid from payments with COMPLETED status
      const totalPaidFromPayments = await this.paymentModel
        .aggregate([
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
              status: 'COMPLETED'
            }
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
        .exec();

      const totalPaidAmount = totalPaidFromPayments.length > 0 ? totalPaidFromPayments[0].total : 0;
      console.log('💰 Total paid amount:', totalPaidAmount);

      // Attach student and totalPaid to each payment
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
        totalPaid: totalPaidAmount,
      }));

      console.log('✅ Final result length:', result.length);
      console.log('=== END CORRECT APPROACH ===');
      
      return result;

    } catch (error) {
      console.error('❌ Error in getPaymentsByUser:', error);
      throw error;
    }
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
          _id: payment._id.toString(),
          user: payment.user?.toString() || '',
          paymentMode: payment.paymentMode || '',
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

  // BEST APPROACH: Using aggregation pipeline
  async getPaymentsByUserOptimized(userId: string): Promise<PaymentWithDetails[]> {
    console.log('=== OPTIMIZED APPROACH ===');
    console.log('Input userId:', userId);

    try {
      if (!Types.ObjectId.isValid(userId)) {
        console.log('❌ Invalid ObjectId format');
        return [];
      }

      const objectId = new Types.ObjectId(userId);

      // Use aggregation to get payments with order details in one query
      const paymentsAggregation = await this.paymentModel.aggregate([
        // Lookup order details
        {
          $lookup: {
            from: 'orders',
            localField: 'order',
            foreignField: '_id',
            as: 'orderData'
          }
        },
        // Filter by user
        {
          $match: {
            'orderData.user': objectId
          }
        },
        // Unwind order data
        {
          $unwind: '$orderData'
        },
        // Lookup user details
        {
          $lookup: {
            from: 'users',
            localField: 'orderData.user',
            foreignField: '_id',
            as: 'userData'
          }
        },
        // Lookup batch details
        {
          $lookup: {
            from: 'batches',
            localField: 'orderData.batch',
            foreignField: '_id',
            as: 'batchData'
          }
        },
        // Lookup course details
        {
          $lookup: {
            from: 'courses',
            localField: 'batchData.course',
            foreignField: '_id',
            as: 'courseData'
          }
        },
        // Project the required fields
        {
          $project: {
            _id: 1,
            paymentMethod: 1,
            transactionId: 1,
            amount: 1,
            status: 1,
            paymentMode: 1,
            createdAt: 1,
            updatedAt: 1,
            order: {
              _id: '$orderData._id',
              user: { $arrayElemAt: ['$userData', 0] },
              totalAmount: '$orderData.totalAmount',
              amountPaid: '$orderData.amountPaid',
              status: '$orderData.status',
              batch: {
                _id: { $arrayElemAt: ['$batchData._id', 0] },
                batchCode: { $arrayElemAt: ['$batchData.batchCode', 0] },
                course: { $arrayElemAt: ['$courseData', 0] }
              },
              createdAt: '$orderData.createdAt',
              updatedAt: '$orderData.updatedAt'
            }
          }
        }
      ]).exec();

      console.log('📊 Aggregation payments found:', paymentsAggregation.length);

      if (paymentsAggregation.length === 0) {
        console.log('❌ No payments found through aggregation');
        return [];
      }

      // Fetch student details
      const student = await this.studentModel
        .findOne({ user: objectId })
        .select('fullName studentType image')
        .lean()
        .exec();

      console.log('👨‍🎓 Student found:', !!student);

      // Calculate totalPaid using aggregation
      const totalPaidAggregation = await this.paymentModel.aggregate([
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
            status: 'COMPLETED'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]).exec();

      const totalPaidAmount = totalPaidAggregation.length > 0 ? totalPaidAggregation[0].total : 0;
      console.log('💰 Total paid amount:', totalPaidAmount);

      // Format the result
      const result = paymentsAggregation.map(payment => ({
        ...payment,
        _id: payment._id.toString(),
        user: payment.order?.user?._id?.toString() || '',
        paymentMode: payment.paymentMode || '',
        student: student
          ? {
              fullName: student.fullName,
              studentType: student.studentType,
              image: student.image || '',
            }
          : null,
        totalPaid: totalPaidAmount,
      }));

      console.log('✅ Final optimized result length:', result.length);
      console.log('=== END OPTIMIZED APPROACH ===');
      
      return result;

    } catch (error) {
      console.error('❌ Error in optimized getPaymentsByUser:', error);
      throw error;
    }
  }
}
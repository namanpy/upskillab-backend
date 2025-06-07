import { Injectable, ForbiddenException } from '@nestjs/common';
import { PaymentStatusDataService } from './payment.status.data';
import {
  GetPaymentStatusResponseDTO,
  PaymentStatusResponse,
} from '../../dto/payment-status.dto';
import { USER_TYPES } from '../../common/constants/user.constants';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class PaymentStatusLogicService {
  constructor(private paymentStatusDataService: PaymentStatusDataService) {}

  private mapToResponse(payment: any, grandTotal: number): PaymentStatusResponse | null {
    if (!payment) {
      console.log('mapToResponse: Skipping null payment');
      return null;
    }

    if (!payment.order || !payment.order._id) {
      console.log(
        'mapToResponse: Skipping payment with missing or invalid order:',
        payment._id?.toString() || 'unknown',
      );
      return null;
    }

    if (
      !payment.order.user ||
      !payment.order.batch ||
      !payment.order.batch.course
    ) {
      console.log(
        'mapToResponse: Skipping payment with missing nested fields:',
        {
          paymentId: payment._id?.toString() || 'unknown',
          hasUser: !!payment.order.user,
          hasBatch: !!payment.order.batch,
          hasCourse: !!payment.order.batch?.course,
        },
      );
      return null;
    }

    try {
              return {
        _id: payment._id.toString(),
        order: {
          _id: payment.order._id.toString(),
          user: {
            _id: payment.order.user._id.toString(),
            email: payment.order.user.email || '',
            username: payment.order.user.username || '',
            isActive: payment.order.user.isActive ?? false,
            mobileNumber: payment.order.user.mobileNumber || '',
            userType: payment.order.user.userType || '',
            student: {
              fullName: payment.student?.fullName || 'Unknown',
              studentType: payment.student?.studentType || 'REGULAR',
              image: payment.student?.image || '',
            },
            totalPaid: grandTotal, // Use the calculated grand total here
          },
          totalAmount: payment.order.totalAmount || 0,
          amountPaid: payment.order.amountPaid || 0,
          status: payment.order.status || '',
          batch: {
            _id: payment.order.batch._id.toString(),
            batchCode: payment.order.batch.batchCode || '',
            course: {
              _id: payment.order.batch.course._id.toString(),
              courseName: payment.order.batch.course.courseName || '',
            },
          },
          createdAt: payment.order.createdAt || null,
          updatedAt: payment.order.updatedAt || null,
        },
        paymentMethod: payment.paymentMethod || '',
        transactionId: payment.transactionId || '',
        amount: payment.amount || 0,
        status: payment.status || '',
        paymentMode: payment.paymentMode || '',
        createdAt: payment.createdAt?.toISOString() || '',
        updatedAt: payment.updatedAt?.toISOString() || '',
      };
    } catch (error) {
      console.error('mapToResponse: Error mapping payment:', {
        paymentId: payment._id?.toString() || 'unknown',
        error: error.message,
      });
      return null;
    }
  }

  async getPaymentStatus(user: User): Promise<GetPaymentStatusResponseDTO> {
    console.log('getPaymentStatus: User:', JSON.stringify(user, null, 2));
    let payments;
    let grandTotal = 0;

    if (user.userType === USER_TYPES.ADMIN) {
      console.log('getPaymentStatus: Fetching all student payments for admin');
      const result = await this.paymentStatusDataService.getAllPayments();
      payments = result.payments;
      grandTotal = result.grandTotal;
    } else if (user.userType === USER_TYPES.STUDENT) {
      console.log('getPaymentStatus: Fetching payments for student:', user._id);
      const result = await this.paymentStatusDataService.getPaymentsByUser(
        user._id.toString(),
      );
      payments = result.payments;
      grandTotal = result.grandTotal;
    } else {
      console.log(
        'getPaymentStatus: Forbidden - Invalid user type:',
        user.userType,
      );
      throw new ForbiddenException(
        'Only students and admins can access payment status',
      );
    }

    const paymentResponses = payments
      .map((payment) => this.mapToResponse(payment, grandTotal))
      .filter((response) => response !== null);

    console.log(
      'getPaymentStatus: Returning',
      paymentResponses.length,
      'payments with grand total:',
      grandTotal,
    );
    
    return {
      payments: paymentResponses,
      grandTotal: grandTotal, // Include grand total in response
    };
  }
}
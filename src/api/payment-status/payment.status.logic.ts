import { Injectable, ForbiddenException } from '@nestjs/common';
import { PaymentStatusDataService } from './payment.status.data';
import { GetPaymentStatusResponseDTO, PaymentStatusResponse } from '../../dto/payment-status.dto';
import { USER_TYPES } from '../../common/constants/user.constants';

@Injectable()
export class PaymentStatusLogicService {
  constructor(private paymentStatusDataService: PaymentStatusDataService) {}

  private mapToResponse(payment: any): PaymentStatusResponse | null {
    if (!payment) {
      console.log('mapToResponse: Skipping null payment');
      return null;
    }

    if (!payment.order || !payment.order._id) {
      console.log('mapToResponse: Skipping payment with missing or invalid order:', payment._id?.toString() || 'unknown');
      return null;
    }

    if (!payment.order.user || !payment.order.batch || !payment.order.batch.course) {
      console.log('mapToResponse: Skipping payment with missing nested fields:', {
        paymentId: payment._id?.toString() || 'unknown',
        hasUser: !!payment.order.user,
        hasBatch: !!payment.order.batch,
        hasCourse: !!payment.order.batch?.course,
      });
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
          },
          totalAmount: payment.order.totalAmount || 0,
          amountPaid: payment.order.amountPaid || 0,
          serialNumber: payment.order.serialNumber || '',
          status: payment.order.status || '',
          batch: {
            _id: payment.order.batch._id.toString(),
            batchCode: payment.order.batch.batchCode || '',
            course: {
              _id: payment.order.batch.course._id.toString(),
              courseName: payment.order.batch.course.courseName || '',
              // courseCode: payment.order.batch.course.courseCode || '',
              // courseImage: payment.order.batch.course.courseImage || '',
              // courseMode: payment.order.batch.course.courseMode || '',
              // courseDuration: payment.order.batch.course.courseDuration || 0,
              // originalPrice: payment.order.batch.course.originalPrice || 0,
              // discountedPrice: payment.order.batch.course.discountedPrice || 0,
              // youtubeUrl: payment.order.batch.course.youtubeUrl || null,
              // brochure: payment.order.batch.course.brochure || '',
              // courseLevel: payment.order.batch.course.courseLevel || '',
              // certificate: payment.order.batch.course.certificate || '',
              // active: payment.order.batch.course.active ?? false,
              // faqs: payment.order.batch.course.faqs || [],
              // shortDescription: payment.order.batch.course.shortDescription || '',
              // tags: payment.order.batch.course.tags || [],
              // programDetails: payment.order.batch.course.programDetails || '',
              // targetAudience: payment.order.batch.course.targetAudience || [],
              // featured: payment.order.batch.course.featured ?? false,
              // courseRating: payment.order.batch.course.courseRating || 0,
              // certifierLogo: payment.order.batch.course.certifierLogo || '',
            },
            // startTime: payment.order.batch.startTime || '',
            // startDate: payment.order.batch.startDate || null,
            // totalSeats: payment.order.batch.totalSeats || 0,
            // remainingSeats: payment.order.batch.remainingSeats || 0,
            // Duration: payment.order.batch.duration || 0,
            // teacher: payment.order.batch.teacher?.toString() || '',
            // imageUrl: payment.order.batch.imageUrl || '',
            // active: payment.order.batch.active ?? false,
            // createdAt: payment.order.batch.createdAt || null,
            // updatedAt: payment.order.batch.updatedAt || null,
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

  async getPaymentStatus(user: any): Promise<GetPaymentStatusResponseDTO> {
    console.log('getPaymentStatus: User:', JSON.stringify(user, null, 2));
    let payments;
    if (user.userType === USER_TYPES.ADMIN) {
      console.log('getPaymentStatus: Fetching all student payments for admin');
      payments = await this.paymentStatusDataService.getAllPayments();
    } else if (user.userType === USER_TYPES.STUDENT) {
      console.log('getPaymentStatus: Fetching payments for student:', user._id);
      payments = await this.paymentStatusDataService.getPaymentsByUser(user._id);
    } else {
      console.log('getPaymentStatus: Forbidden - Invalid user type:', user.userType);
      throw new ForbiddenException('Only students and admins can access payment status');
    }

    const paymentResponses = payments
      .map(payment => this.mapToResponse(payment))
      .filter(response => response !== null);

    console.log('getPaymentStatus: Returning', paymentResponses.length, 'payments');
    return {
      payments: paymentResponses,
    };
  }
}
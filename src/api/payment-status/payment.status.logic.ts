import { Injectable, ForbiddenException } from '@nestjs/common';
import { PaymentStatusDataService } from './payment.status.data';
import { GetPaymentStatusResponseDTO, PaymentStatusResponse } from '../../dto/payment-status.dto';
import { USER_TYPES } from '../../common/constants/user.constants';

@Injectable()
export class PaymentStatusLogicService {
  constructor(
    private paymentStatusDataService: PaymentStatusDataService,
  ) {}

  private mapToResponse(payment: any): PaymentStatusResponse | null {
    if (!payment.order) return null; // Skip if no matching order
    return {
      _id: payment._id.toString(),
      order: {
        _id: payment.order._id.toString(),
        user: {
          _id: payment.order.user._id.toString(),
          email: payment.order.user.email,
          username: payment.order.user.username,
          isActive: payment.order.user.isActive,
          mobileNumber: payment.order.user.mobileNumber,
          userType: payment.order.user.userType,
        },
        totalAmount: payment.order.totalAmount,
        amountPaid: payment.order.amountPaid,
        status: payment.order.status,
        batch: {
          _id: payment.order.batch._id.toString(),
          batchCode: payment.order.batch.batchCode,
          course: {
            _id: payment.order.batch.course._id.toString(),
            courseName: payment.order.batch.course.courseName,
            courseCode: payment.order.batch.course.courseCode,
            courseImage: payment.order.batch.course.courseImage,
            courseMode: payment.order.batch.course.courseMode,
            courseDuration: payment.order.batch.course.courseDuration,
            originalPrice: payment.order.batch.course.originalPrice,
            discountedPrice: payment.order.batch.course.discountedPrice,
            youtubeUrl: payment.order.batch.course.youtubeUrl,
            brochure: payment.order.batch.course.brochure,
            courseLevel: payment.order.batch.course.courseLevel,
            certificate: payment.order.batch.course.certificate,
            active: payment.order.batch.course.active,
            faqs: payment.order.batch.course.faqs,
            shortDescription: payment.order.batch.course.shortDescription,
            tags: payment.order.batch.course.tags,
            programDetails: payment.order.batch.course.programDetails,
            targetAudience: payment.order.batch.course.targetAudience,
            featured: payment.order.batch.course.featured,
            courseRating: payment.order.batch.course.courseRating,
            certifierLogo: payment.order.batch.course.certifierLogo,
          },
          startTime: payment.order.batch.startTime,
          startDate: payment.order.batch.startDate,
          totalSeats: payment.order.batch.totalSeats,
          remainingSeats: payment.order.batch.remainingSeats,
          Duration: payment.order.batch.duration, // Fixed: duration → Duration
          teacher: payment.order.batch.teacher.toString(),
          imageUrl: payment.order.batch.imageUrl,
          active: payment.order.batch.active,
          createdAt: payment.order.batch.createdAt,
          updatedAt: payment.order.batch.updatedAt,
        },
        createdAt: payment.order.createdAt,
        updatedAt: payment.order.updatedAt,
      },
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      amount: payment.amount,
      status: payment.status,
      paymentMode: payment.paymentMode,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    };
  }

  async getPaymentStatus(user: any): Promise<GetPaymentStatusResponseDTO> {
    console.log('getPaymentStatus: User:', JSON.stringify(user, null, 2));
    let payments;
    if (user.userType === USER_TYPES.ADMIN) {
      console.log('getPaymentStatus: Fetching all payments for admin');
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
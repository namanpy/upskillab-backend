import { Injectable } from '@nestjs/common';
import { UserDataService } from '../user/users.data';
import { OrderDataService } from '../order/order.data';
import { PaymentDataService } from '../payment/payment.data';
import { BatchDataService } from '../batch/batch.data';
import { CashfreeService } from '../payment/cashfree.logic';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { ORDER_STATUS } from 'src/common/constants/order.constants';
import { BatchRegistrationRequestDto } from 'src/dto/registration.dto';
import { SendGridService } from 'src/common/services/sendgrid.service';
import { USER_TYPES } from 'src/common/constants/user.constants';

@Injectable()
export class RegistrationLogicService {
  constructor(
    private userDataService: UserDataService,
    private orderDataService: OrderDataService,
    private batchDataService: BatchDataService,
    private cashfreeService: CashfreeService,
    private sendGridService: SendGridService,
  ) {}

  async registerForBatch(registrationData: BatchRegistrationRequestDto) {
    // Check if batch exists and is active
    const batch = await this.batchDataService.getBatchById(
      registrationData.batchId,
    );
    if (!batch || new Date(batch.startDate) < new Date() || !batch.active) {
      throw new CustomError(ERROR.BATCH_NOT_ACTIVE);
    }

    // Check if seats are available
    if (batch.remainingSeats <= 0) {
      throw new CustomError(ERROR.BATCH_FULL);
    }

    // Create or get user
    let user = await this.userDataService.getUserByEmail({
      email: registrationData.email,
    });

    if (!user) {
      user = await this.userDataService.createUser({
        email: registrationData.email,
        username: `user_${Math.random().toString(36).substring(2, 10)}`,
        userType: USER_TYPES.STUDENT,
      });

      // Send welcome email
      await this.sendGridService.sendWelcomeEmail({
        to: user.email,
        name: registrationData.name,
      });
    }

    const courseId = batch.course._id;
    const userId = user._id;

    // Check if user has already registered for the cours
    const existingOrdere = await this.orderDataService.checkExistingOrder(
      userId,
      courseId,
    );

    if (existingOrdere) {
      throw new CustomError(ERROR.ALREADY_REGISTERED_FOR_COURSE);
    }
    // Create order
    const order = await this.orderDataService.createOrder({
      user: user._id,
      batch: batch._id,
      totalAmount: batch.course.discountedPrice || batch.course.originalPrice,
      amountPaid: 0,
      status: ORDER_STATUS.PENDING.code,
    });

    // Create Cashfree payment link
    const paymentLink = await this.cashfreeService.createPayment({
      orderId: order._id,
      userId: user._id,
      amount: order.totalAmount,
      customerDetails: {
        customerId: user._id.toString(),
        customerEmail: user.email,
        customerPhone: registrationData.phone,
        customerName: registrationData.name,
      },
    });

    return {
      orderId: order._id,
      paymentSessionId: paymentLink.paymentSessionId!,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { UserDataService } from '../user/users.data';
import { OrderDataService } from '../order/order.data';
import { PaymentDataService } from '../payment/payment.data';
import { BatchDataService } from '../batch/batch.data';
import { CashfreeService } from '../payment/cashfree.logic';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { ORDER_STATUS } from 'src/common/constants/order.constants';
import {
  BatchRegistrationRequestDto,
  NoBatchRegistrationRequestDto,
  NoBatchsRegistrationRequestDto,
  registerExternelPaymentDto,
} from 'src/dto/registration.dto';
import { SendGridService } from 'src/common/services/sendgrid.service';
import { USER_TYPES } from 'src/common/constants/user.constants';
import { StudentDataService } from '../student/student.data';
import { STUDENT_TYPE } from 'src/common/constants/student.constants';
import { NotificationLogicService } from '../notification/notification.logic';
import { CouponLogicService } from '../coupon/coupon.logic';
import { ReferralLogicService } from '../referral/referral.logic';
import { ReferralDataService } from '../referral/referral.data';
@Injectable()
export class RegistrationLogicService {
  constructor(
    private userDataService: UserDataService,
    private orderDataService: OrderDataService,
    private batchDataService: BatchDataService,
    private cashfreeService: CashfreeService,
    private sendGridService: SendGridService,
    private studentDataService: StudentDataService,
    private notificationLogicService: NotificationLogicService,
    private referralLogicService: ReferralLogicService,
    private referralDataService: ReferralDataService,
    private CouponLogicService: CouponLogicService, // <-- Add this
  ) { }

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
        mobileNumber: registrationData.phone,
        username: `user_${Math.random().toString(36).substring(2, 10)}`,
        userType: USER_TYPES.STUDENT,
      });

      await this.studentDataService.createStudent({
        user: user._id,
        fullName: registrationData.name,
        studentType: STUDENT_TYPE.REGULAR.code,
      });

      // Send welcome email
      //   await this.sendGridService.sendWelcomeEmail({
      //     to: user.email,
      //     name: registrationData.name,
      //   });
    }

    const courseId = batch.course._id;
    const userId = user._id;

    // Check if user has already registered for the cours
    const existingOrder = await this.orderDataService.checkExistingOrder(
      userId,
      courseId,
    );

    if (existingOrder && existingOrder.status === ORDER_STATUS.COMPLETED.code) {
      throw new CustomError(ERROR.ALREADY_REGISTERED_FOR_COURSE);
    }
    // Calculate base price
    let totalAmount =
      batch.course.discountedPrice || batch.course.originalPrice;
    let discount = 0;
    let appliedCouponId: Types.ObjectId | undefined = undefined;
    console.log(totalAmount, '1');
    // --- Coupon logic ---
    if (registrationData.couponCode) {
      const coupon = await this.CouponLogicService.validateCoupon(
        registrationData.couponCode,
        batch._id,
      );
      if (!coupon) {
        throw new CustomError(ERROR.INVALID_COUPON);
      }
      discount = (totalAmount * coupon?.discountPercent) / 100;
      if (coupon?.maxDiscountAmount && discount > coupon?.maxDiscountAmount) {
        discount = coupon?.maxDiscountAmount;
      }
      totalAmount = totalAmount - discount;
      appliedCouponId = coupon._id;
    }


if (registrationData.referralCode) {
  const referralResult = await this.referralLogicService.validateReferralCode(
    registrationData.referralCode,
    courseId);

  // Apply discount logic here, subtract from totalAmount
  const referralDiscount = (totalAmount * referralResult.discountValue) / 100;
  totalAmount -= referralDiscount;
    console.log(referralDiscount,totalAmount)
  // Save referred user for tracking
  await this.referralDataService.addReferredUser(
    registrationData.referralCode,
    userId,
    courseId,
    'pending',
  );
}

    // Create order
    const order = await this.orderDataService.createOrder({
      user: user._id,
      batch: batch._id,
      totalAmount,
      amountPaid: 0,
      mobileNumber: registrationData.phone,
      status: ORDER_STATUS.PENDING.code,
      coupon: appliedCouponId,
    });

    console.log(appliedCouponId, totalAmount, '2');
    console.log(order, '3');
    // Create Cashfree payment link
    const paymentLink = await this.cashfreeService.createPayment({
      orderId: order._id,
      userId: user._id,
      amount: Number(totalAmount.toFixed(2)),
      customerDetails: {
        customerId: user._id.toString(),
        customerEmail: user.email,
        customerPhone: registrationData.phone,
        customerName: registrationData.name,
      },
    });

    await this.notificationLogicService.createNotification({
      message: `New order Created By ${registrationData.name} email:${registrationData.email}`,
      role: 'admin',
      type: 'Order',
    });

    return {
      orderId: order._id,
      totalAmount: Number(order.totalAmount.toFixed(2)),
      paymentSessionId: paymentLink.paymentSessionId!,
    };
  }

  async registerNoBatch(registrationData: NoBatchRegistrationRequestDto) {
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

    // Get course total amount (original price of the course)
    const totalAmount = batch.course.discountedPrice || batch.course.originalPrice;

    // Create or get user
    let user = await this.userDataService.getUserByEmail({
      email: registrationData.email,
    });

    if (!user) {
      user = await this.userDataService.createUser({
        email: registrationData.email,
        mobileNumber: registrationData.phone,
        username: `user_${Math.random().toString(36).substring(2, 10)}`,
        userType: USER_TYPES.STUDENT,
      });

      await this.studentDataService.createStudent({
        user: user._id,
        fullName: registrationData.name,
        studentType: STUDENT_TYPE.REGULAR.code,
      });

      // Send welcome email
      //   await this.sendGridService.sendWelcomeEmail({
      //     to: user.email,
      //     name: registrationData.name,
      //   });
    }

    const courseId = batch.course._id;
    const userId = user._id;

    // Check if user has already registered for the course
    const existingOrder = await this.orderDataService.checkExistingOrder(
      userId,
      courseId,
    );

    if (existingOrder && existingOrder.status === ORDER_STATUS.COMPLETED.code) {
      throw new CustomError(ERROR.ALREADY_REGISTERED_FOR_COURSE);
    }

    // Create order
    const order = await this.orderDataService.createOrder({
      user: user._id,
      batch: batch._id,
      amountPaid: registrationData.amount, // Amount user has paid
      totalAmount, // Batch amount + user paid amount
      email: registrationData.email,
      name: registrationData.name,
      mobileNumber: registrationData.phone,
      status: ORDER_STATUS.PENDING.code,
      source:"manual"
    });

    // Create Cashfree payment link
    const paymentLink = await this.cashfreeService.createPayment({
      orderId: order._id,
      userId: user._id,
      amount: order.amountPaid,
      customerDetails: {
        customerId: user._id.toString(),
        customerEmail: user.email,
        customerPhone: registrationData.phone,
        customerName: registrationData.name,
      },
    });

    await this.notificationLogicService.createNotification({
      message: `New order Created By ${registrationData.name} email:${registrationData.email}`,
      role: 'admin',
      type: 'Order',
    });

    return {
      orderId: order._id,
      totalAmount: order.totalAmount,
      amountPaying: registrationData.amount,
      paymentSessionId: paymentLink.paymentSessionId!,
    };
  }
  async registerNoBatchs(registrationData: NoBatchsRegistrationRequestDto) {
    // Calculate base price
    let totalAmount = registrationData.amount;
    let user = await this.userDataService.getUserByEmail({
      email: registrationData.email,
    });

    if (!user) {
      user = await this.userDataService.createUser({
        email: registrationData.email,
        mobileNumber: registrationData.phone,
        username: `user_${Math.random().toString(36).substring(2, 10)}`,
        userType: USER_TYPES.STUDENT,
      });

      await this.studentDataService.createStudent({
        user: user._id,
        fullName: registrationData.name,
        studentType: STUDENT_TYPE.REGULAR.code,
      });
    }
    // Create order
    const order = await this.orderDataService.createOrder({
      amountPaid: 0,
      totalAmount,
      user: user._id,
      email: registrationData.email,
      name: registrationData.name,
      courseName: registrationData.courseName,
      mobileNumber: registrationData.phone,
      status: ORDER_STATUS.PENDING.code,
      source:"manual"
    });

    // Create Cashfree payment link
    const paymentLink = await this.cashfreeService.createPayment({
      orderId: order._id,
      amount: order.totalAmount,
      customerDetails: {
        customerId: 'upskillab',
        customerEmail: registrationData.email,
        customerPhone: registrationData.phone,
        customerName: registrationData.name,
      },
    });

    await this.notificationLogicService.createNotification({
      message: `New order Created By ${registrationData.name} email:${registrationData.email}`,
      role: 'admin',
      type: 'Order',
    });

    return {
      orderId: order._id,
      amountPaying: order.totalAmount,
      paymentSessionId: paymentLink.paymentSessionId!,
    };
  }


  async registerExternelPayment(registrationData: registerExternelPaymentDto) {
    // Calculate base price
    if(registrationData?.batchId){ 
    const batch = await this.batchDataService.getBatchById(
      registrationData.batchId,
    );
    if (!batch) {
      throw new CustomError(ERROR.BATCH_NOT_FOUND);
    }

    // // Check if seats are available
    // if (batch.remainingSeats <= 0) {
    //   throw new CustomError(ERROR.BATCH_FULL);
    // }


     

    // Create or get user
    let user = await this.userDataService.getUserByEmail({
      email: registrationData.email,
    });

    if (!user) {
      user = await this.userDataService.createUser({
        email: registrationData.email,
        mobileNumber: registrationData.phone,
        username: `user_${Math.random().toString(36).substring(2, 10)}`,
        userType: USER_TYPES.STUDENT,
      });

      await this.studentDataService.createStudent({
        user: user._id,
        fullName: registrationData.name,
        studentType: STUDENT_TYPE.REGULAR.code,
      });

      // Send welcome email
      //   await this.sendGridService.sendWelcomeEmail({
      //     to: user.email,
      //     name: registrationData.name,
      //   });
    }

    const courseId = batch.course._id;
    const userId = user._id;

    // Check if user has already registered for the cours
    const existingOrder = await this.orderDataService.checkExistingOrder(
      userId,
      courseId,
    );
let totalAmount = registrationData.amount;
  
    if (existingOrder && existingOrder.status === ORDER_STATUS.COMPLETED.code) {
      console.log(existingOrder)
  //     totalAmount: 19999,
  // amountPaid: 19999,
  // status: 'COMPLETED',
      if(existingOrder.totalAmount===existingOrder.amountPaid){
        throw new CustomError(ERROR.ALREADY_REGISTERED_FOR_COURSE);
      }else{
        totalAmount=existingOrder.amountPaid+totalAmount
        await this.orderDataService.updateOrder(existingOrder._id,{amountPaid:totalAmount})
      }
    }
    totalAmount = batch.course.discountedPrice || batch.course.originalPrice;
  
const order = await this.orderDataService.createOrder({
      user: user._id,
      batch: batch._id,
      amountPaid: registrationData.amount, // Amount user has paid
      totalAmount, // Batch amount + user paid amount
      email: registrationData.email,
      mode:registrationData.mode,
      name: registrationData.name,
      mobileNumber: registrationData.phone,
      status:"COMPLETED",
      source:"manual"
    });

    }
else{


    let totalAmount = registrationData.amount;
    let user = await this.userDataService.getUserByEmail({
      email: registrationData.email,
    });

    if (!user) {
      user = await this.userDataService.createUser({
        email: registrationData.email,
        mobileNumber: registrationData.phone,
        username: `user_${Math.random().toString(36).substring(2, 10)}`,
        userType: USER_TYPES.STUDENT,
      });

      await this.studentDataService.createStudent({
        user: user._id,
        fullName: registrationData.name,
        studentType: STUDENT_TYPE.REGULAR.code,
      });
    }
    const order = await this.orderDataService.createOrder({
      amountPaid: totalAmount,
      user:user._id,
      totalAmount,
      email: registrationData.email,
      name: registrationData.name,
      courseName: registrationData.courseName,
      mode: registrationData.mode,
      mobileNumber: registrationData.phone,
      status: "COMPLETED",
      source:"manual"
    });

    }

    // Create Cashfree payment link

    return {"message":"Register Succesfull"};
  }


}

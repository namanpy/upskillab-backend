import { Injectable, BadRequestException } from '@nestjs/common';
import { CouponDataService } from './coupon.data';
import { BatchDataService } from '../batch/batch.data';
import { CourseDataService } from '../course/course.data';
import { Types } from 'mongoose';

@Injectable()
export class CouponLogicService {
  constructor(
    private couponDataService: CouponDataService,
    private batchDataService: BatchDataService,
    private courseDataService: CourseDataService,
  ) {}

  async createCoupon(data: {
    code: string;
    discountPercent: number;
    maxDiscountAmount?: number;
    course?: string;
    batch?: string;
    validFrom?: Date;
    validTo?: Date;
    active?: boolean;
  }) {
    // Validate course ID if provided
    if (data.course) {
      const course = await this.courseDataService.getCourseById(data.course);
      if (!course) {
        throw new BadRequestException(
          `Course with ID ${data.course} not found`,
        );
      }
    }
    // Validate batch ID if provided
    if (data.batch) {
      const batch = await this.batchDataService.getBatchById(data.batch);
      if (!batch) {
        throw new BadRequestException(`Batch with ID ${data.batch} not found`);
      }
    }
    return this.couponDataService.createCoupon(data);
  }

  async validateCoupon(
    code: string,
    batchId?: Types.ObjectId,
    courseId?: Types.ObjectId,
  ) {
    return this.couponDataService.validateCoupon(code, courseId, batchId);
  }


  async adminValidateCoupon(
  code: string,
  courseId?: Types.ObjectId,
  batchId?: Types.ObjectId,
): Promise<{ valid: boolean; message: string }> {
  const coupon = await this.couponDataService.validateCouponRaw(code); // Use raw query first

  if (!coupon) {
    return { valid: false, message: 'Coupon not found or inactive' };
  }

  const now = new Date();

  // Check validFrom / validTo
  if (coupon.validFrom && coupon.validFrom > now) {
    return { valid: false, message: 'Coupon is not yet valid' };
  }

  if (coupon.validTo && coupon.validTo < now) {
    return { valid: false, message: 'Coupon has expired' };
  }

  // Check course/batch match
  if (
    (coupon.course && courseId && !coupon.course.equals(courseId)) ||
    (coupon.batch && batchId && !coupon.batch.equals(batchId))
  ) {
    return { valid: false, message: 'Coupon does not match course or batch' };
  }

  return { valid: true, message: 'Coupon is valid' };
}

  async getAllCoupons(page = 1, limit = 10) {
    return this.couponDataService.getAllCoupons(page, limit);
  }


  async getCouponsByCourse(courseId: string) {
  const course = await this.courseDataService.getCourseById(courseId);
  if (!course) {
    throw new BadRequestException(`Course with ID ${courseId} not found`);
  }

  return this.couponDataService.getCouponsByCourse(courseId);
}


  async updateCoupon(
    id: string,
    data: Partial<{
      discountPercent: number;
      maxDiscountAmount?: number;
      course?: string;
      batch?: string;
      validFrom?: Date;
      validTo?: Date;
      active?: boolean;
    }>,
  ) {
    // Validate course ID if provided
    if (data.course) {
      const course = await this.courseDataService.getCourseById(data.course);
      if (!course) {
        throw new BadRequestException(
          `Course with ID ${data.course} not found`,
        );
      }
    }
    // Validate batch ID if provided
    if (data.batch) {
      const batch = await this.batchDataService.getBatchById(data.batch);
      if (!batch) {
        throw new BadRequestException(`Batch with ID ${data.batch} not found`);
      }
    }

    // Optionally validate course/batch IDs here as in createCoupon
    return this.couponDataService.updateCoupon(id, data);
  }
}

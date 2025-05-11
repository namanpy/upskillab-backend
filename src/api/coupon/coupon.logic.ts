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
    courseId?: Types.ObjectId,
    batchId?: Types.ObjectId,
  ) {
    return this.couponDataService.validateCoupon(code, courseId, batchId);
  }

  async getAllCoupons(page = 1, limit = 10) {
    return this.couponDataService.getAllCoupons(page, limit);
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

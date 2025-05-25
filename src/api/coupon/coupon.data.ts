import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from 'src/schemas/coupon.schema';
import { Model, Types } from 'mongoose';
import { Batch } from 'src/schemas/course/batch.schema';
import { Course } from 'src/schemas/course/course.schema';

@Injectable()
export class CouponDataService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}

async validateCoupon(
    code: string,
    courseId?: Types.ObjectId,
    batchId?: Types.ObjectId,
  ) {
    const now = new Date();
    return this.couponModel.findOne({
      code,
      active: true,
      $and: [
        {
          $or: [
            { course: courseId },
            { batch: batchId },
            { course: null, batch: null },
          ],
        },
        { $or: [{ validFrom: { $lte: now } }, { validFrom: null }] },
        { $or: [{ validTo: { $gte: now } }, { validTo: null }] },
      ],
    });
  }

  async validateCouponRaw(code: string) {
  return this.couponModel
    .findOne({ code: code.toLowerCase(), active: true })
    .exec();
}

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
    return this.couponModel.create({
      ...data,
      course: data.course ? new Types.ObjectId(data.course) : undefined,
      batch: data.batch ? new Types.ObjectId(data.batch) : undefined,
    });
  }

  async getAllCoupons(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [coupons, total] = await Promise.all([
      this.couponModel
        .find()
        .populate<{
          batch: Batch;
          course: Course;
        }>(['batch', 'course'])
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.couponModel.countDocuments(),
    ]);
    return {
      coupons,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

async getCouponsByCourse(courseId: string) {
  const now = new Date();

  return this.couponModel
    .find({
      course: new Types.ObjectId(courseId),
      active: true,
      $and: [
        { $or: [{ validFrom: { $lte: now } }, { validFrom: null }] },
        { $or: [{ validTo: { $gte: now } }, { validTo: null }] },
      ],
    })
    .populate([
  { path: 'course' },
  {
    path: 'batch',
    populate: {
      path: 'course',
      model: 'Course',
    },
  },
])
    .lean()
    .exec();
}

  async updateCoupon(id: string, data: any) {
    return this.couponModel.findByIdAndUpdate(id, data, { new: true });
  }
}

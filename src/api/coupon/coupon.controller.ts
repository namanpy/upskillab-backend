import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CouponLogicService } from './coupon.logic';
import { Types } from 'mongoose';
import { PaginatedCouponsResponseDto } from '../../dto/coupon.dto';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
class CreateCouponDto {
  code: string;
  discountPercent: number;
  maxDiscountAmount?: number;
  course?: string;
  batch?: string;
  validFrom?: Date;
  validTo?: Date;
  active?: boolean;
}

class UpdateCouponDto {
  discountPercent?: number;
  maxDiscountAmount?: number;
  course?: string;
  batch?: string;
  validFrom?: Date;
  validTo?: Date;
  active?: boolean;
}

@Controller('coupons')
export class CouponController {
  constructor(private couponLogicService: CouponLogicService) {}

 @Get('validate')
async validate(
  @Query('code') code: string,
  @Query('courseId') courseId?: string,
  @Query('batchId') batchId?: string,
) {
  const result = await this.couponLogicService.validateCoupon(
    code,
    courseId ? new Types.ObjectId(courseId) : undefined,
    batchId ? new Types.ObjectId(batchId) : undefined,
  );
  return result;
}

@Get('coupon/validate')
async couponValidate(
  @Query('code') code: string,
  @Query('courseId') courseId?: string,
  @Query('batchId') batchId?: string,
) {
  const result = await this.couponLogicService.adminValidateCoupon(
    code,
    courseId ? new Types.ObjectId(courseId) : undefined,
    batchId ? new Types.ObjectId(batchId) : undefined,
  );
  return result;
}


  @Post()
  async createCoupon(@Body() body: CreateCouponDto) {
    return this.couponLogicService.createCoupon(body);
  }

  // --- NEW: Get all coupons ---
  @Get()

  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: PaginatedCouponsResponseDto })
  async getAllCoupons(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedCouponsResponseDto> {
    return this.couponLogicService.getAllCoupons(Number(page), Number(limit));
  }

  @Get('by-course/:courseId')
async getCouponsByCourse(@Param('courseId') courseId: string) {
  return this.couponLogicService.getCouponsByCourse(courseId);
}

  // --- NEW: Edit coupon by ID ---
  @Patch(':id')
  async updateCoupon(@Param('id') id: string, @Body() body: UpdateCouponDto) {
    return this.couponLogicService.updateCoupon(id, body);
  }
}

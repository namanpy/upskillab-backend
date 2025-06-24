import { Injectable } from '@nestjs/common';
import { CreateReferralDto, ValidateReferralDto, ApplyReferralResultDto } from 'src/dto/referral.dto';
import { ReferralDataService } from './referral.data';
import { v4 as uuidv4 } from 'uuid';
import { ReferralSettingsService } from './referral.settings';
import { Types } from 'mongoose';
@Injectable()
export class ReferralLogicService {
  constructor(
    private referralDataService: ReferralDataService,
    private referralSettingsService: ReferralSettingsService,
  ) {}

  async generateReferralCode(dto: CreateReferralDto, userId: any) {
    console.log(dto,userId)
    let referral = await this.referralDataService.getByUserId(userId);

    if (!referral) {
      referral = await this.referralDataService.create({
        userId: userId,
        code: uuidv4().slice(0, 8),
        courseIds: [new Types.ObjectId(dto.courseId)],
        referredUsers: [],
      });
    } else if (!referral.courseIds.includes(new Types.ObjectId(dto.courseId))) {
      await this.referralDataService.addCourseToReferral((referral._id as Types.ObjectId), new Types.ObjectId(dto.courseId));
    }

    return referral;
  }

  async validateReferralCode(code: string, courseId: any): Promise<ApplyReferralResultDto> {
    const referral = await this.referralDataService.getByCode(code);
    if (!referral || !referral.courseIds.includes(courseId)) {
      throw new Error('Invalid referral');
    }

    const discount = await this.referralSettingsService.getActiveSettings();
    return {
      referredBy: referral.userId.toString(),
      courseId: courseId,
      discountType: 'percentage',
      discountValue: discount?.discountPercentage ?? 0,
    };
  }

  async getReferralsByUser(userId: string | Types.ObjectId) {
    console.log(userId,1)
  return this.referralDataService.getByUserId(userId);
}

async getAllReferrals() {
  return this.referralDataService.getAll();
}

async updateReferredUserStatus(
  referralCode: string,
  userId: string,
  courseId: string,
  status: 'pending' | 'completed',
) {
  return this.referralDataService.updateReferredUserStatus(referralCode, userId, courseId, status);
}
}
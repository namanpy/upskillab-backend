import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ReferralSettings,
  ReferralSettingsDocument,
} from 'src/schemas/referral-settings.schema';

@Injectable()
export class ReferralSettingsService {
  constructor(
    @InjectModel(ReferralSettings.name)
    private referralSettingsModel: Model<ReferralSettingsDocument>,
  ) {}

  // ✅ Get active settings
  async getActiveSettings(): Promise<ReferralSettings | null> {
    return await this.referralSettingsModel.findOne({ isActive: true });
  }

  // ✅ Create new setting and deactivate previous ones
async updateSettings(discountPercentage: number,isActive: boolean): Promise<ReferralSettings> {
  const existingSetting = await this.referralSettingsModel.findOne({ isActive: true });

  if (existingSetting) {
    existingSetting.discountPercentage = discountPercentage;
    existingSetting.isActive= isActive;
    return await existingSetting.save();
  } else {
    return await this.referralSettingsModel.create({
      discountPercentage,
      isActive: true,
    });
  }
}


  // ✅ Optional: Get all history (for admin)
  async getAllSettings(): Promise<ReferralSettings[]> {
    return await this.referralSettingsModel.find().sort({ createdAt: -1 });
  }
}

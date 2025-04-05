import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from '../../../schemas/home/banner.schema';
import { CreateBannerDto } from '../../../dto/home/banner.dto';

@Injectable()
export class BannerDataService {
  constructor(@InjectModel(Banner.name) private bannerModel: Model<BannerDocument>) {}

  async getBanners(): Promise<BannerDocument[]> {
    return this.bannerModel.find().exec();
  }

  async createBanner(createBannerDto: CreateBannerDto & { imageUrl: string }): Promise<BannerDocument> {
    const newBanner = new this.bannerModel(createBannerDto);
    return newBanner.save();
  }

  async getBannerById(id: string): Promise<BannerDocument | null> {
    return this.bannerModel.findById(id).exec();
  }

  async updateBanner(id: string, updateBannerDto: Partial<CreateBannerDto & { imageUrl: string }>): Promise<BannerDocument | null> {
    return this.bannerModel.findByIdAndUpdate(id, updateBannerDto, { new: true }).exec();
  }

  async deleteBanner(id: string): Promise<BannerDocument | null> {
    return this.bannerModel.findByIdAndDelete(id).exec();
  }
}
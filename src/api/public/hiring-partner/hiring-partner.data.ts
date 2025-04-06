import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HiringPartner, HiringPartnerDocument } from '../../../schemas/home/hiring-partner.schema';
import { CreateHiringPartnerDto } from '../../../dto/home/hiring-partner.dto';

@Injectable()
export class HiringPartnerDataService {
  constructor(@InjectModel(HiringPartner.name) private hiringPartnerModel: Model<HiringPartnerDocument>) {}

  async getHiringPartners(): Promise<HiringPartnerDocument[]> {
    return this.hiringPartnerModel.find().exec();
  }

  async createHiringPartner(createHiringPartnerDto: CreateHiringPartnerDto & { logo: string }): Promise<HiringPartnerDocument> {
    const newHiringPartner = new this.hiringPartnerModel(createHiringPartnerDto);
    return newHiringPartner.save();
  }

  async getHiringPartnerById(id: string): Promise<HiringPartnerDocument | null> {
    return this.hiringPartnerModel.findById(id).exec();
  }

  async updateHiringPartner(id: string, updateHiringPartnerDto: Partial<CreateHiringPartnerDto & { logo: string }>): Promise<HiringPartnerDocument | null> {
    return this.hiringPartnerModel.findByIdAndUpdate(id, updateHiringPartnerDto, { new: true }).exec();
  }

  async deleteHiringPartner(id: string): Promise<HiringPartnerDocument | null> {
    return this.hiringPartnerModel.findByIdAndDelete(id).exec();
  }
}
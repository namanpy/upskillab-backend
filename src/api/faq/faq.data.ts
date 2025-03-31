import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FAQ, FAQDocument } from '../../schemas/home/faq.schema';
import { CreateFAQDto } from '../../dto/home/faq.dto';

@Injectable()
export class FAQDataService {
  constructor(
    @InjectModel(FAQ.name) private faqModel: Model<FAQDocument>,
  ) {}

  async getFAQs(): Promise<FAQDocument[]> {
    return this.faqModel.find().exec();
  }

  async createFAQ(createFAQDto: CreateFAQDto): Promise<FAQDocument> {
    const newFAQ = new this.faqModel(createFAQDto);
    return newFAQ.save();
  }

  async getFAQById(id: string): Promise<FAQDocument | null> {
    return this.faqModel.findById(id).exec();
  }

  async updateFAQ(
    id: string,
    updateFAQDto: Partial<CreateFAQDto>,
  ): Promise<FAQDocument | null> {
    return this.faqModel
      .findByIdAndUpdate(id, updateFAQDto, { new: true })
      .exec();
  }

  async deleteFAQ(id: string): Promise<FAQDocument | null> {
    return this.faqModel.findByIdAndDelete(id).exec();
  }
}
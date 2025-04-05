import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactUs, ContactUsDocument } from '../../../schemas/home/contact-us.schema';
import { CreateContactUsDto } from '../../../dto/home/contact-us.dto';

@Injectable()
export class ContactUsDataService {
  constructor(@InjectModel(ContactUs.name) private contactUsModel: Model<ContactUsDocument>) {}

  async getContactUsEntries(): Promise<ContactUsDocument[]> {
    return this.contactUsModel.find().exec();
  }

  async createContactUs(createContactUsDto: CreateContactUsDto): Promise<ContactUsDocument> {
    const newContactUs = new this.contactUsModel(createContactUsDto);
    return newContactUs.save();
  }

  async getContactUsById(id: string): Promise<ContactUsDocument | null> {
    return this.contactUsModel.findById(id).exec();
  }

  async updateContactUs(id: string, updateContactUsDto: Partial<CreateContactUsDto>): Promise<ContactUsDocument | null> {
    return this.contactUsModel.findByIdAndUpdate(id, updateContactUsDto, { new: true }).exec();
  }

  async deleteContactUs(id: string): Promise<ContactUsDocument | null> {
    return this.contactUsModel.findByIdAndDelete(id).exec();
  }
}
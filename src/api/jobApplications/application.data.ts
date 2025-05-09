import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from '../../schemas/application.schema';

@Injectable()
export class ApplicationDataService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
  ) {}

  async createApplication(applicationData: Omit<Application, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApplicationDocument> {
    try {
      const newApplication = new this.applicationModel(applicationData);
      return await newApplication.save();
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error (unique constraint violation)
        throw new BadRequestException('You have already applied for this job with this email or phone number');
      }
      throw error;
    }
  }

  async getApplications(): Promise<ApplicationDocument[]> {
    return this.applicationModel.find().exec();
  }

  async getApplicationById(id: string): Promise<ApplicationDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid application ID');
    }
    return this.applicationModel.findById(id).exec();
  }

  async deleteApplication(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid application ID');
    }
    const result = await this.applicationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new BadRequestException('Application not found');
    }
  }
}
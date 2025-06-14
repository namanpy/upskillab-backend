import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Application,
  ApplicationDocument,
} from '../../schemas/application.schema';

@Injectable()
export class ApplicationDataService {
  constructor(
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
  ) {}

  async createApplication(
    applicationData: Omit<Application, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApplicationDocument> {
    try {
      const newApplication = new this.applicationModel(applicationData);
      // console.log(newApplication);
      return await newApplication.save();
    } catch (error) {
      if (error.code === 11000) {
        console.log(error)
        // Duplicate key error (unique constraint violation)
        throw new BadRequestException(
          'You have already applied for this job with this email',
        );
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

async getApplicationsByJobId(jobId: Types.ObjectId): Promise<Application[]> {
  return this.applicationModel.find({ jobId }).lean();
}

async getApplicationsByEmail(email: string) {
  return this.applicationModel
    .find({ email })
    .populate('jobId') // Ensure it populates the job details
    .exec();
}

async deleteApplication(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid application ID');
    }
    const result = await this.applicationModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
    if (!result) {
      throw new BadRequestException('Application not found');
    }
  }
}

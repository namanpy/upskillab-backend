import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job, JobDocument } from '../../schemas/job.schema';
import { CreateJobData, UpdateJobData } from '../../dto/job.dto'; // Updated imports

@Injectable()
export class JobDataService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
  ) {}

  async getJobs(): Promise<JobDocument[]> {
    return this.jobModel.find().exec();
  }

  async getJobById(id: string): Promise<JobDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid job ID');
    }
    return this.jobModel.findById(id).exec();
  }

  async createJob(createJobData: CreateJobData): Promise<JobDocument> { // Updated type
    const newJob = new this.jobModel(createJobData);
    return newJob.save();
  }

  async updateJob(id: string, updateJobData: UpdateJobData): Promise<JobDocument | null> { // Updated type
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid job ID');
    }
    return this.jobModel.findByIdAndUpdate(id, updateJobData, { new: true }).exec();
  }

  async deleteJob(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid job ID');
    }
    const result = await this.jobModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new BadRequestException('Job not found');
    }
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { JobDataService } from './job.data';
import { CreateJobDto, GetJobsResponseDTO, JobResponse, UpdateJobDto } from '../../dto/job.dto';
import { ImageUploaderService } from '../../common/services/image-uploader.service';

@Injectable()
export class JobLogicService {
  constructor(
    private jobDataService: JobDataService,
    private imageUploaderService: ImageUploaderService,
  ) {}

  async getJobs(): Promise<GetJobsResponseDTO> {
    const jobs = await this.jobDataService.getJobs();
    return {
      jobs: jobs.map((job) => ({
        _id: job._id.toString(),
        title: job.title,
        subtitle: job.subtitle,
        description: job.description,
        company: job.company,
        logo: job.logo,
        skills: job.skills,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      })),
    };
  }

  async getJobById(id: string): Promise<{ job: JobResponse }> {
    const job = await this.jobDataService.getJobById(id);
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return {
      job: {
        _id: job._id.toString(),
        title: job.title,
        subtitle: job.subtitle,
        description: job.description,
        company: job.company,
        logo: job.logo,
        skills: job.skills,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      },
    };
  }

  async createJob(createJobDto: CreateJobDto): Promise<{ job: JobResponse }> {
    // If logo file is provided, upload to S3 and get URL
    let logoUrl = '';
    if (createJobDto.logo) {
      logoUrl = await this.imageUploaderService.uploadImage(
        createJobDto.logo,
        'jobs',
        Date.now().toString(),
      );
    }

    // Prepare the job data for saving
    const jobData = {
      title: createJobDto.title,
      subtitle: createJobDto.subtitle,
      description: createJobDto.description,
      company: createJobDto.company,
      logo: logoUrl,
      skills: createJobDto.skills as string[], // Ensure skills is string[]
    };

    const job = await this.jobDataService.createJob(jobData);
    return {
      job: {
        _id: job._id.toString(),
        title: job.title,
        subtitle: job.subtitle,
        description: job.description,
        company: job.company,
        logo: job.logo,
        skills: job.skills,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      },
    };
  }

  async updateJob(id: string, updateJobDto: UpdateJobDto): Promise<{ job: JobResponse }> {
    // If logo file is provided, upload to S3 and get URL
    let logoUrl: string | undefined;
    if (updateJobDto.logo) {
      logoUrl = await this.imageUploaderService.uploadImage(
        updateJobDto.logo,
        'jobs',
        id,
      );
    }

    // Prepare the job data for updating
    const jobData = {
      title: updateJobDto.title,
      subtitle: updateJobDto.subtitle,
      description: updateJobDto.description,
      company: updateJobDto.company,
      logo: logoUrl,
      skills: updateJobDto.skills as string[] | undefined, // Ensure skills is string[] | undefined
    };

    const job = await this.jobDataService.updateJob(id, jobData);
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return {
      job: {
        _id: job._id.toString(),
        title: job.title,
        subtitle: job.subtitle,
        description: job.description,
        company: job.company,
        logo: job.logo,
        skills: job.skills,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      },
    };
  }

  async deleteJob(id: string): Promise<void> {
    await this.jobDataService.deleteJob(id);
  }
}
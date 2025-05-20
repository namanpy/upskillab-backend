import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ApplicationDataService } from './application.data';
import { CreateApplicationDto, GetApplicationsResponseDTO, ApplicationResponse } from '../../dto/application.dto';
import { FileUploaderService } from '../../common/services/file-uploader.service';

@Injectable()
export class ApplicationLogicService {
  constructor(
    private applicationDataService: ApplicationDataService,
    private fileUploaderService: FileUploaderService,
  ) {}

  async createApplication(createApplicationDto: CreateApplicationDto): Promise<{ application: ApplicationResponse }> {
    // Validate jobId
    if (!Types.ObjectId.isValid(createApplicationDto.jobId)) {
      throw new BadRequestException('Invalid job ID');
    }

    // Upload resume PDF to S3 and get URL
    const uploadResult = await this.fileUploaderService.uploadFiles(
      [createApplicationDto.resume],
      'resumes',
    );

    const resumeUrl = uploadResult[0].fileUrl;

    // Prepare application data
    const applicationData = {
      fullName: createApplicationDto.fullName,
      email: createApplicationDto.email,
      phoneNumber: createApplicationDto.phoneNumber,
      jobId: new Types.ObjectId(createApplicationDto.jobId),
      qualification: createApplicationDto.qualification,
      source: createApplicationDto.source,
      resumeUrl,
    };

    const application = await this.applicationDataService.createApplication(applicationData);
    return {
      application: {
        _id: application._id.toString(),
        fullName: application.fullName,
        email: application.email,
        phoneNumber: application.phoneNumber,
        jobId: application.jobId.toString(),
        qualification: application.qualification,
        resumeUrl: application.resumeUrl,
        source: application.source,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
    };
  }

  async getApplications(): Promise<GetApplicationsResponseDTO> {
    const applications = await this.applicationDataService.getApplications();
    return {
      applications: applications.map(app => ({
        _id: app._id.toString(),
        fullName: app.fullName,
        email: app.email,
        phoneNumber: app.phoneNumber,
        jobId: app.jobId.toString(),
        qualification: app.qualification,
        resumeUrl: app.resumeUrl,
        source: app.source,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
      })),
    };
  }

  async getApplicationById(id: string): Promise<{ application: ApplicationResponse }> {
    const application = await this.applicationDataService.getApplicationById(id);
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    return {
      application: {
        _id: application._id.toString(),
        fullName: application.fullName,
        email: application.email,
        phoneNumber: application.phoneNumber,
        jobId: application.jobId.toString(),
        qualification: application.qualification,
        resumeUrl: application.resumeUrl,
        source: application.source,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
    };
  }


async getApplicationByJobId(jobId: string){
  if (!Types.ObjectId.isValid(jobId)) {
    throw new BadRequestException('Invalid job ID');
  }

  const applications = await this.applicationDataService.getApplicationsByJobId(new Types.ObjectId(jobId));

  return { applications };
}

async getAppliedJobsByStudent(email: string) {
  const applications = await this.applicationDataService.getApplicationsByEmail(email);

  return {
    jobs: applications.map(app => app.jobId), // If jobId is populated
  };
}


  async deleteApplication(id: string){
   await this.applicationDataService.deleteApplication(id);
   return { message: 'Applications deleted successfully' };
  }
}
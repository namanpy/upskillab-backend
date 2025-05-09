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
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
    };
  }

  async deleteApplication(id: string): Promise<void> {
    await this.applicationDataService.deleteApplication(id);
  }
}
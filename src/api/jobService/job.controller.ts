import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JobLogicService } from './job.logic';
import {
  CreateJobDto,
  GetJobsResponseDTO,
  UpdateJobDto,
} from '../../dto/job.dto';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AllowUserType, UserGuard } from '../../common/guard/user.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { USER_TYPES } from '../../common/constants/user.constants';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private jobLogicService: JobLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all jobs',
    type: GetJobsResponseDTO,
  })
  @Get('')
  async getJobs(): Promise<GetJobsResponseDTO> {
    return await this.jobLogicService.getJobs();
  }

  @ApiResponse({
    status: 200,
    description: 'Get a single job by ID',
  })
  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return await this.jobLogicService.getJobById(id);
  }

  @ApiResponse({
    status: 201,
    description: 'Create a new job',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), UserGuard, RolesGuard)
  @AllowUserType(USER_TYPES.ADMIN)
  @Roles(USER_TYPES.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  @Post('')
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    // Process skills
    createJobDto.skills = this.processSkills(createJobDto.skills);
    createJobDto.logo = logo;
    return await this.jobLogicService.createJob(createJobDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a job by ID',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), UserGuard, RolesGuard)
  @AllowUserType(USER_TYPES.ADMIN)
  @Roles(USER_TYPES.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  @Put(':id')
  async updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    // Process skills if they exist
    if (updateJobDto.skills) {
      updateJobDto.skills = this.processSkills(updateJobDto.skills);
    }

    updateJobDto.logo = logo;
    return await this.jobLogicService.updateJob(id, updateJobDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a job by ID',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), UserGuard, RolesGuard)
  @AllowUserType(USER_TYPES.ADMIN)
  @Roles(USER_TYPES.ADMIN)
  @HttpCode(200)
  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return await this.jobLogicService.deleteJob(id);
  }

  /**
   * Helper method to process skills in various formats
   * @param skills Skills in string, string[], or JSON string format
   * @returns Processed skills as string[]
   */
  private processSkills(skills: string | string[]): string[] {
    // If it's already an array, return it
    if (Array.isArray(skills)) {
      return skills;
    }

    // If it's a string, try to parse it as JSON
    if (typeof skills === 'string') {
      try {
        const parsedSkills = JSON.parse(skills);
        // Check if the parsed result is an array
        if (Array.isArray(parsedSkills)) {
          return parsedSkills;
        }
        // If parsed but not an array, split by comma
        return skills.split(',').map((skill) => skill.trim());
      } catch {
        // Not valid JSON, treat as comma-separated string
        return skills.split(',').map((skill) => skill.trim());
      }
    }

    // Default fallback - return empty array
    return [];
  }
}

import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApplicationLogicService } from './application.logic';
  import { CreateApplicationDto, GetApplicationsResponseDTO } from '../../dto/application.dto';
  import { ApiResponse, ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
  import { AuthGuard } from '@nestjs/passport';
  import { AllowUserType, UserGuard } from '../../common/guard/user.guard';
  import { RolesGuard } from '../../common/guard/roles.guard';
  import { USER_TYPES } from '../../common/constants/user.constants';
  import { Roles } from 'src/common/decorators/roles.decorator';
  
  @ApiTags('applications')
  @Controller('applications')
  export class ApplicationController {
    constructor(private applicationLogicService: ApplicationLogicService) {}
  
    @ApiResponse({
      status: 201,
      description: 'Apply for a job',
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('resume', {
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(new BadRequestException('Only PDF files are allowed for resume'), false);
        }
        callback(null, true);
      },
    }))
    @UsePipes(new ValidationPipe({ 
      transform: true,
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      // Skip validation for 'resume' field
      groups: ['createApplication'],
    }))
    @Post('')
    async createApplication(
      @Body() createApplicationDto: CreateApplicationDto,
      @UploadedFile() resume: Express.Multer.File,
    ) {
      // Check if resume file is provided
      if (!resume) {
        throw new BadRequestException('Resume file is required');
      }
  
      createApplicationDto.resume = resume;
      return await this.applicationLogicService.createApplication(createApplicationDto);
    }
  
    @ApiResponse({
      status: 200,
      description: 'Get all applications',
      type: GetApplicationsResponseDTO,
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), UserGuard, RolesGuard)
    @AllowUserType(USER_TYPES.ADMIN)
    @Roles(USER_TYPES.ADMIN)
    @Get('')
    async getApplications(): Promise<GetApplicationsResponseDTO> {
      return await this.applicationLogicService.getApplications();
    }
  
    @ApiResponse({
      status: 200,
      description: 'Get a single application by ID',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), UserGuard, RolesGuard)
    @AllowUserType(USER_TYPES.ADMIN)
    @Roles(USER_TYPES.ADMIN)
    @Get(':id')
    async getApplicationById(@Param('id') id: string) {
      return await this.applicationLogicService.getApplicationById(id);
    }
  
    @ApiResponse({
      status: 200,
      description: 'Delete an application by ID',
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), UserGuard, RolesGuard)
    @AllowUserType(USER_TYPES.ADMIN)
    @Roles(USER_TYPES.ADMIN)
    @Delete(':id')
    async deleteApplication(@Param('id') id: string) {
      return await this.applicationLogicService.deleteApplication(id);
    }
  }
// src/api/feedback/feedback.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FeedbackLogicService } from './feedback.logic';
import {
  CreateFeedbackDto,
  UpdateFeedbackDto,
  GetFeedbacksResponseDTO,
  GetTeacherFeedbackSummaryResponseDTO,
  GetAllTeachersSummaryResponseDTO,
} from '../../dto/feedback.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Feedback')
@Controller('feedback')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FeedbackController {
  constructor(private feedbackLogicService: FeedbackLogicService) {}

  // Student endpoints
@Post()
@Roles('STUDENT')
@ApiOperation({ summary: 'Student gives feedback to teacher for a class session' })
@ApiResponse({ status: 201, description: 'Feedback created successfully' })
async createFeedback(
  @Body() createFeedbackDto: CreateFeedbackDto,
  @Request() req
) {
  const res = await this.feedbackLogicService.createFeedback(createFeedbackDto, req.user);
  return res;
}

  @Get('my-feedbacks')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Student gets their own feedbacks' })
  @ApiResponse({ status: 200, description: 'Student feedbacks retrieved successfully' })
  async getStudentFeedbacks(@Request() req): Promise<GetFeedbacksResponseDTO> {
    return this.feedbackLogicService.getStudentFeedbacks(req.user);
  }

  @Patch(':id')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Student updates their feedback' })
  @ApiResponse({ status: 200, description: 'Feedback updated successfully' })
  async updateFeedback(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
    @Request() req
  ) {
    return this.feedbackLogicService.updateFeedback(id, updateFeedbackDto, req.user);
  }

  @Delete(':id')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Student deletes their feedback' })
  @ApiResponse({ status: 200, description: 'Feedback deleted successfully' })
  async deleteFeedback(@Param('id') id: string, @Request() req) {
    return this.feedbackLogicService.deleteFeedback(id, req.user);
  }

  // Admin endpoints
  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin gets all feedbacks' })
  @ApiResponse({ status: 200, description: 'All feedbacks retrieved successfully' })
  async getAllFeedbacks(@Request() req): Promise<GetFeedbacksResponseDTO> {
    return this.feedbackLogicService.getAllFeedbacks(req.user);
  }

  @Get('teachers-summary')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin gets all teachers feedback summary' })
  @ApiResponse({ status: 200, description: 'All teachers feedback summary retrieved successfully' })
  async getAllTeachersFeedbackSummary(@Request() req): Promise<GetAllTeachersSummaryResponseDTO> {
    return this.feedbackLogicService.getAllTeachersFeedbackSummary(req.user);
  }

  @Get('teacher/:teacherId/summary')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin gets specific teacher feedback summary' })
  @ApiResponse({ status: 200, description: 'Teacher feedback summary retrieved successfully' })
  async getTeacherFeedbackSummary(
    @Param('teacherId') teacherId: string,
    @Request() req
  ): Promise<GetTeacherFeedbackSummaryResponseDTO> {
    return this.feedbackLogicService.getTeacherFeedbackSummary(teacherId, req.user);
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin gets feedback by ID' })
  @ApiResponse({ status: 200, description: 'Feedback retrieved successfully' })
  async getFeedbackById(@Param('id') id: string, @Request() req) {
    return this.feedbackLogicService.getFeedbackById(id, req.user);
  }
}
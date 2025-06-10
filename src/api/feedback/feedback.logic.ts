// src/api/feedback/feedback.logic.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { FeedbackDataService } from './feedback.data';
import {
  CreateFeedbackDto,
  UpdateFeedbackDto,
  GetFeedbacksResponseDTO,
  FeedbackDto,
  TeacherFeedbackSummaryDto,
  GetTeacherFeedbackSummaryResponseDTO,
  GetAllTeachersSummaryResponseDTO,
} from '../../dto/feedback.dto';
import { FeedbackDocument } from '../../schemas/feedback.schema';
import { ClassSessionDataService } from '../scheduler/class-session.data';
import { TeacherDataService } from '../teachers/teacher.data';
import { EnrollmentDataService } from '../enrollment/enrollment.data';
import { USER_TYPES } from '../../common/constants/user.constants';

@Injectable()
export class FeedbackLogicService {
  constructor(
    private feedbackDataService: FeedbackDataService,
    private classSessionDataService: ClassSessionDataService,
    private teacherDataService: TeacherDataService,
    private enrollmentDataService: EnrollmentDataService,
  ) {}

  private mapToDto(feedback: FeedbackDocument): FeedbackDto {
    return {
      _id: (feedback._id as Types.ObjectId).toString(),
      studentId: (feedback.studentId as Types.ObjectId).toString(),
      teacherId: (feedback.teacherId as Types.ObjectId).toString(),
      classSessionId: (feedback.classSessionId as Types.ObjectId).toString(),
      batchId: (feedback.batchId as Types.ObjectId).toString(),
      rating: feedback.rating,
      message: feedback.message,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
      studentName: (feedback.studentId as any)?.username || '',
      teacherName: (feedback.teacherId as any)?.username || '',
      batchName: (feedback.batchId as any)?.name || '',
      sessionTitle: (feedback.classSessionId as any)?.title || '',
    };
  }

  // Student creates feedback
  async createFeedback(createFeedbackDto: CreateFeedbackDto, user: any) {
    if (user.userType !== USER_TYPES.STUDENT) {
      throw new ForbiddenException('Only students can give feedback');
    }

    // Check if class session exists and is approved
    const classSession = await this.classSessionDataService.getClassSessionById(
      createFeedbackDto.classSessionId
    );
    if (!classSession) {
      throw new NotFoundException('Class session not found');
    }
    if (!classSession.isApproved) {
      throw new BadRequestException('Cannot give feedback for unapproved sessions');
    }

    // Check if teacher exists
    const teacher = await this.teacherDataService.getTeacherById(
      createFeedbackDto.teacherId
    );
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Verify teacher is assigned to this session
    if (classSession.teacherId.toString() !== createFeedbackDto.teacherId) {
      throw new BadRequestException('Teacher is not assigned to this session');
    }

    // Check if student is enrolled in the batch
    const enrollment = await this.enrollmentDataService.getEnrollmentByUserId(user._id);
    const enrolledBatchIds = enrollment.order.map(order => order.batch._id.toString());
    
    if (!enrolledBatchIds.includes(classSession.batchId.toString())) {
      throw new ForbiddenException('You are not enrolled in this batch');
    }

    // Check if feedback already exists for this session
    const existingFeedback = await this.feedbackDataService.checkExistingFeedback(
      user._id,
      createFeedbackDto.classSessionId
    );
    if (existingFeedback) {
      throw new BadRequestException('You have already given feedback for this session');
    }

    // Create feedback
    const feedbackData = {
      ...createFeedbackDto,
      studentId: user._id,
      batchId: classSession.batchId.toString(),
    };

    const feedback = await this.feedbackDataService.createFeedback(feedbackData);
    const populatedFeedback = await this.feedbackDataService.getFeedbackById(
      (feedback._id as Types.ObjectId).toString()
    );

    return {
      feedback: this.mapToDto(populatedFeedback!),
    };
  }

  // Student gets their own feedbacks
  async getStudentFeedbacks(user: any): Promise<GetFeedbacksResponseDTO> {
    if (user.userType !== USER_TYPES.STUDENT) {
      throw new ForbiddenException('Only students can access their feedbacks');
    }

    const feedbacks = await this.feedbackDataService.getFeedbacksByStudent(user._id);
    return {
      feedbacks: feedbacks.map(feedback => this.mapToDto(feedback)),
    };
  }

  // Student updates their feedback
  async updateFeedback(id: string, updateFeedbackDto: UpdateFeedbackDto, user: any) {
    if (user.userType !== USER_TYPES.STUDENT) {
      throw new ForbiddenException('Only students can update their feedbacks');
    }

    const feedback = await this.feedbackDataService.getFeedbackById(id);
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    if ((feedback.studentId as Types.ObjectId).toString() !== user._id) {
      throw new ForbiddenException('You can only update your own feedback');
    }

    const updatedFeedback = await this.feedbackDataService.updateFeedback(
      id,
      updateFeedbackDto
    );
    if (!updatedFeedback) {
      throw new NotFoundException('Feedback not found');
    }

    return {
      feedback: this.mapToDto(updatedFeedback),
    };
  }

  // Student deletes their feedback
  async deleteFeedback(id: string, user: any) {
    if (user.userType !== USER_TYPES.STUDENT) {
      throw new ForbiddenException('Only students can delete their feedbacks');
    }

    const feedback = await this.feedbackDataService.getFeedbackById(id);
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    if ((feedback.studentId as Types.ObjectId).toString() !== user._id) {
      throw new ForbiddenException('You can only delete your own feedback');
    }

    await this.feedbackDataService.deleteFeedback(id);
    return { message: 'Feedback deleted successfully' };
  }

  // Admin gets all feedbacks
  async getAllFeedbacks(user: any): Promise<GetFeedbacksResponseDTO> {
    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('Only admins can access all feedbacks');
    }

    const feedbacks = await this.feedbackDataService.getAllFeedbacks();
    return {
      feedbacks: feedbacks.map(feedback => this.mapToDto(feedback)),
    };
  }

  // Admin gets teacher feedback summary
  async getTeacherFeedbackSummary(
    teacherId: string,
    user: any
  ): Promise<GetTeacherFeedbackSummaryResponseDTO> {
    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('Only admins can access teacher feedback summaries');
    }

    const teacher = await this.teacherDataService.getTeacherById(teacherId);
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const summaryData = await this.feedbackDataService.getTeacherFeedbackSummary(teacherId);
    const recentFeedbacks = await this.feedbackDataService.getRecentFeedbacksForTeacher(teacherId);

    if (!summaryData) {
      return {
        summary: {
          _id: teacherId,
          teacherName: (teacher as any).username || 'Unknown',
          totalFeedbacks: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          recentFeedbacks: [],
        },
      };
    }

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    summaryData.ratings.forEach((rating: number) => {
      ratingDistribution[rating as keyof typeof ratingDistribution]++;
    });

    const summary: TeacherFeedbackSummaryDto = {
      _id: teacherId,
      teacherName: summaryData.user.username,
      totalFeedbacks: summaryData.totalFeedbacks,
      averageRating: Math.round(summaryData.averageRating * 100) / 100, // Round to 2 decimal places
      ratingDistribution,
      recentFeedbacks: recentFeedbacks.map(feedback => this.mapToDto(feedback)),
    };

    return { summary };
  }

  // Admin gets all teachers feedback summary
  async getAllTeachersFeedbackSummary(user: any): Promise<GetAllTeachersSummaryResponseDTO> {
    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('Only admins can access all teachers feedback summaries');
    }

    const summariesData = await this.feedbackDataService.getAllTeachersFeedbackSummary();

    const teachers: TeacherFeedbackSummaryDto[] = summariesData.map((data) => {
      // Calculate rating distribution
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      data.ratings.forEach((rating: number) => {
        ratingDistribution[rating as keyof typeof ratingDistribution]++;
      });

      return {
        _id: data._id.toString(),
        teacherName: data.user.username,
        totalFeedbacks: data.totalFeedbacks,
        averageRating: Math.round(data.averageRating * 100) / 100,
        ratingDistribution,
        recentFeedbacks: [], // We'll populate this separately if needed
      };
    });

    return { teachers };
  }

  // Get feedback by ID (for admin)
  async getFeedbackById(id: string, user: any) {
    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('Only admins can access feedback details');
    }

    const feedback = await this.feedbackDataService.getFeedbackById(id);
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    return {
      feedback: this.mapToDto(feedback),
    };
  }
}
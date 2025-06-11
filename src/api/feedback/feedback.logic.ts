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
  ) { }

  private mapToDto(feedback: FeedbackDocument): FeedbackDto {
    // Helper function to safely extract ID
    const extractId = (field: any): string => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      if (field._id) return field._id.toString();
      if (field.toString && typeof field.toString === 'function') {
        return field.toString();
      }
      return '';
    };

    // Helper function to extract name/title
    const extractName = (field: any, property: string): string => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      if (field[property]) return field[property];
      return '';
    };

    return {
      _id: extractId(feedback._id),
      studentId: extractId(feedback.studentId),
      teacherId: extractId(feedback.teacherId),
      classSessionId: extractId(feedback.classSessionId),
      batchId: extractId(feedback.batchId),
      rating: feedback.rating,
      message: feedback.message,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
      studentName: extractName(feedback.studentId, 'username'),
      teacherName: extractName(feedback.teacherId, 'username'),
      batchName: extractName(feedback.batchId, 'name'),
      sessionTitle: extractName(feedback.classSessionId, 'title'),
    };
  }

  // Fixed createFeedback method - Ensures one feedback per student per class session
  async createFeedback(createFeedbackDto: CreateFeedbackDto, user: any) {
    if (user.userType !== USER_TYPES.STUDENT) {
      throw new ForbiddenException('Only students can give feedback');
    }

    // FIRST: Check if feedback already exists for this student and class session
    // This should be the first check to prevent duplicate feedback
    const existingFeedback = await this.feedbackDataService.checkExistingFeedback(
      user._id,
      createFeedbackDto.classSessionId
    );
    
    if (existingFeedback) {
      throw new BadRequestException('You have already given feedback for this class session');
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

    // Fix: Handle populated teacherId object safely
    const sessionTeacherId = (classSession.teacherId as any)?._id
      ? (classSession.teacherId as any)._id.toString()
      : classSession.teacherId.toString();

    if (sessionTeacherId !== createFeedbackDto.teacherId) {
      throw new BadRequestException('Teacher is not assigned to this session');
    }

    // Check if student is enrolled in the batch
    const enrollment = await this.enrollmentDataService.getEnrollmentByUserId(user._id);
    if (!enrollment || !enrollment.order || enrollment.order.length === 0) {
      throw new ForbiddenException('You are not enrolled in any batch');
    }

    const enrolledBatchIds = enrollment.order.map(order => order.batch._id.toString());

    // Fix: Handle populated batchId object safely
    const sessionBatchId = (classSession.batchId as any)?._id
      ? (classSession.batchId as any)._id.toString()
      : classSession.batchId.toString();

    if (!enrolledBatchIds.includes(sessionBatchId)) {
      throw new ForbiddenException('You are not enrolled in this batch');
    }

    // Create feedback - by this point we're sure no duplicate exists
    const feedbackData = {
      ...createFeedbackDto,
      studentId: user._id,
      batchId: sessionBatchId,
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
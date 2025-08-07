// src/api/feedback/feedback.data.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PipelineStage } from 'mongoose';
import { Feedback, FeedbackDocument } from '../../schemas/feedback.schema';
import { CreateFeedbackDto, UpdateFeedbackDto } from '../../dto/feedback.dto';

@Injectable()
export class FeedbackDataService {
  constructor(
    @InjectModel(Feedback.name)
    private feedbackModel: Model<FeedbackDocument>,
  ) {}

  // Create feedback
  async createFeedback(
    createFeedbackDto: CreateFeedbackDto & { studentId: string; batchId: string }
  ): Promise<FeedbackDocument> {
    const newFeedback = new this.feedbackModel(createFeedbackDto);
    return newFeedback.save();
  }

  // Check if student already gave feedback for this session
  async checkExistingFeedback(
    studentId: any,
    classSessionId: string
  ): Promise<FeedbackDocument | null> {
    return this.feedbackModel
      .findOne({ 
        studentId,
        classSessionId 
      })
      .exec();
  }

  // Get feedback by ID
  async getFeedbackById(id: string): Promise<FeedbackDocument | null> {
    return this.feedbackModel
      .findById(new Types.ObjectId(id))
      .populate('studentId', 'fullName')
      .populate('teacherId', 'name')
      .populate('batchId', 'name')
      .populate('classSessionId', 'title')
      .lean()
      .exec();
  }

  // Get all feedbacks by student
  async getFeedbacksByStudent(studentId: string): Promise<FeedbackDocument[]> {
    return this.feedbackModel
      .find({ studentId: new Types.ObjectId(studentId) })
      .populate('teacherId', 'name')
      .populate('batchId', 'name')
      .populate('classSessionId', 'title')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  // Get all feedbacks for a teacher
  async getFeedbacksByTeacher(teacherId: string): Promise<FeedbackDocument[]> {
    return this.feedbackModel
      .find({ teacherId: new Types.ObjectId(teacherId) })
      .populate('studentId', 'username')
      .populate('batchId', 'name')
      .populate('classSessionId', 'title')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  // Get all feedbacks (for admin)
  async getAllFeedbacks(): Promise<FeedbackDocument[]> {
    return this.feedbackModel
      .find()
      .populate('studentId', 'username')
      .populate('teacherId', 'username')
      .populate('batchId', 'name')
      .populate('classSessionId', 'title')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  // Update feedback
  async updateFeedback(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto
  ): Promise<FeedbackDocument | null> {
    return this.feedbackModel
      .findByIdAndUpdate(
        new Types.ObjectId(id),
        { ...updateFeedbackDto, updatedAt: new Date() },
        { new: true }
      )
      .populate('teacherId', 'username')
      .populate('batchId', 'name')
      .populate('classSessionId', 'title')
      .lean()
      .exec();
  }

  // Delete feedback
  async deleteFeedback(id: string): Promise<FeedbackDocument | null> {
    return this.feedbackModel
      .findByIdAndDelete(new Types.ObjectId(id))
      .exec();
  }

  // Get teacher feedback summary
  async getTeacherFeedbackSummary(teacherId: string) {
    const pipeline: PipelineStage[] = [
      {
        $match: { teacherId: new Types.ObjectId(teacherId) }
      },
      {
        $group: {
          _id: '$teacherId',
          totalFeedbacks: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratings: { $push: '$rating' }
        }
      },
      {
        $lookup: {
          from: 'teachers',
          localField: '_id',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      {
        $unwind: '$teacher'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'teacher.userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      }
    ];

    const result = await this.feedbackModel.aggregate(pipeline).exec();
    return result[0] || null;
  }

  // Get all teachers feedback summary
  async getAllTeachersFeedbackSummary() {
    const pipeline: PipelineStage[] = [
      {
        $group: {
          _id: '$teacherId',
          totalFeedbacks: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratings: { $push: '$rating' }
        }
      },
      {
        $lookup: {
          from: 'teachers',
          localField: '_id',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      {
        $unwind: '$teacher'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'teacher.userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $sort: { averageRating: -1 }
      }
    ];

    return this.feedbackModel.aggregate(pipeline).exec();
  }

  // Get recent feedbacks for a teacher
  async getRecentFeedbacksForTeacher(teacherId: string, limit: number = 5): Promise<FeedbackDocument[]> {
    return this.feedbackModel
      .find({ teacherId: new Types.ObjectId(teacherId) })
      .populate('studentId', 'username')
      .populate('batchId', 'name')
      .populate('classSessionId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
  }
}
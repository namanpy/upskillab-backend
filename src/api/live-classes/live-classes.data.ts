import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassSession, ClassSessionDocument } from '../../schemas/class-session.schema';
import { Attendance, AttendanceDocument } from '../../schemas/attendance.schema';
import { MarkAttendanceDto } from '../../dto/live-classes.dto';

@Injectable()
export class LiveClassesDataService {
  constructor(
    @InjectModel(ClassSession.name) private classSessionModel: Model<ClassSessionDocument>,
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
  ) { }

  async getLiveClasses(): Promise<ClassSessionDocument[]> {
    // Fetch live classes for today or future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    return this.classSessionModel
      .find({
        scheduledDate: { $gte: today },
      })
      .sort({ scheduledDate: 1, scheduledStartTime: 1 })
      .exec();
  }

  async getLiveClassById(classId: string): Promise<ClassSessionDocument | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    const liveClass = await this.classSessionModel
      .findOne({
        _id: classId,
        scheduledDate: { $gte: today },
      })
      .exec();
    if (!liveClass) {
      throw new NotFoundException(`Live class with ID ${classId} not found or not scheduled`);
    }
    return liveClass;
  }

  async markAttendance(
    classId: string,
    userId: string,
    markAttendanceDto: MarkAttendanceDto,
  ): Promise<AttendanceDocument> {
    // Check if the class exists and is scheduled for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const liveClass = await this.classSessionModel
      .findOne({
        _id: classId,
        scheduledDate: today,
      })
      .exec();

    if (!liveClass) {
      throw new BadRequestException(
        `Live class with ID ${classId} not found or not scheduled for today`,
      );
    }

    // Check if attendance already marked
    const existingAttendance = await this.attendanceModel
      .findOne({ classId, userId })
      .exec();
    if (existingAttendance) {
      throw new BadRequestException(
        `Attendance already marked for user ${userId} in class ${classId}`,
      );
    }

    // Mark attendance
    const attendanceData = {
      classId,
      userId,
      isAttended: markAttendanceDto.isAttended,
    };
    const newAttendance = new this.attendanceModel(attendanceData);
    return newAttendance.save();
  }
  async getUserAttendance(userId: string): Promise<{ classSession: ClassSessionDocument; attendance: AttendanceDocument | null }[]> {
    // Get all upcoming classes (similar to getLiveClasses())
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    const classSessions = await this.classSessionModel
      .find({
        scheduledDate: { $gte: today },
      })
      .sort({ scheduledDate: 1, scheduledStartTime: 1 })
      .exec();

    // Get all attendance records for this user for these classes
    const attendances = await this.attendanceModel
      .find({
        userId,
        classId: { $in: classSessions.map(session => session._id) }
      })
      .exec();

    // Map attendance records to classes
    return classSessions.map(classSession => {
      const attendance = attendances.find(
        attendance => attendance.classId.toString() === classSession._id.toString()
      );

      return {
        classSession,
        attendance: attendance || null,
      };
    });
  }
}
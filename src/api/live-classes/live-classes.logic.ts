import { Injectable, NotFoundException } from '@nestjs/common';
import { LiveClassesDataService } from './live-classes.data';
import { LiveClassesResponseDto, LiveClassResponseDto, MarkAttendanceDto, MarkAttendanceResponseDto, UserAttendanceResponseDto } from '../../dto/live-classes.dto';
import { ClassSessionDocument } from '../../schemas/class-session.schema';
import { AttendanceDocument } from '../../schemas/attendance.schema';

@Injectable()
export class LiveClassesLogicService {
  constructor(private liveClassesDataService: LiveClassesDataService) {}

  async getLiveClasses(): Promise<LiveClassesResponseDto> {
    const classes = await this.liveClassesDataService.getLiveClasses();
    return {
      classes: classes.map((liveClass: ClassSessionDocument) => ({
        _id: liveClass._id,
        meetingLink: liveClass.meetingLink,
        scheduledDate: liveClass.scheduledDate,
        scheduledStartTime: liveClass.scheduledStartTime,
        isAttended: false, // Default for listing all classes
      })),
    };
  }

  async getLiveClassById(classId: string): Promise<LiveClassResponseDto> {
    const liveClass = await this.liveClassesDataService.getLiveClassById(classId);
    if (!liveClass) {
      throw new NotFoundException(`Live class with ID ${classId} not found`);
    }
    return {
      _id: liveClass._id,
      meetingLink: liveClass.meetingLink,
      scheduledDate: liveClass.scheduledDate,
      scheduledStartTime: liveClass.scheduledStartTime,
      isAttended: false, // Default for single class
    };
  }

  async markAttendance(
    classId: string,
    userId: string,
    markAttendanceDto: MarkAttendanceDto,
  ): Promise<MarkAttendanceResponseDto> {
    const attendance = await this.liveClassesDataService.markAttendance(
      classId,
      userId,
      markAttendanceDto,
    );
    return {
      _id: attendance._id,
      classId: attendance.classId,
      userId: attendance.userId,
      isAttended: attendance.isAttended,
      createdAt: attendance.createdAt,
      updatedAt: attendance.updatedAt,
    };
  }

  async getUserAttendance(userId: string): Promise<UserAttendanceResponseDto> {
    const attendanceData = await this.liveClassesDataService.getUserAttendance(userId);
    return {
      classes: attendanceData.map(({ classSession, attendance }) => ({
        _id: classSession._id,
        meetingLink: classSession.meetingLink,
        scheduledDate: classSession.scheduledDate,
        scheduledStartTime: classSession.scheduledStartTime,
        isAttended: attendance ? attendance.isAttended : false,
      })),
    };
  }
}
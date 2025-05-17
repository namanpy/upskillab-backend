import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { LiveClassesDataService } from './live-classes.data';
import { LiveClassesResponseDto, LiveClassResponseDto, MarkAttendanceDto, MarkAttendanceResponseDto, UserAttendanceResponseDto } from '../../dto/live-classes.dto';
import { ClassSessionDocument } from '../../schemas/class-session.schema';
import { AttendanceDocument } from '../../schemas/attendance.schema';

@Injectable()
export class LiveClassesLogicService {
  constructor(private liveClassesDataService: LiveClassesDataService) {}

  async getLiveClasses(userId: string): Promise<LiveClassesResponseDto> {
    console.log('getLiveClasses: Starting for userId:', userId);
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      console.log('getLiveClasses: Invalid userId format:', userId);
      throw new BadRequestException('Invalid user ID');
    }

    console.log('getLiveClasses: Fetching all classes');
    const classes = await this.liveClassesDataService.getLiveClasses();
    console.log('getLiveClasses: Classes found:', classes.map(cls => ({
      _id: cls._id.toString(),
      scheduledDate: cls.scheduledDate.toISOString()
    })));

    console.log('getLiveClasses: Fetching attendance for userId:', userId);
    const attendanceRecords = await this.liveClassesDataService.getAttendanceForClasses(
      userId,
      classes.map(cls => cls._id.toString())
    );
    console.log('getLiveClasses: Attendance records:', attendanceRecords.map(rec => ({
      classId: rec.classId.toString(),
      userId: rec.userId.toString(),
      isAttended: rec.isAttended
    })));

    return {
      classes: classes.map((liveClass: ClassSessionDocument) => {
        const classId = liveClass._id.toString();
        const attendance = attendanceRecords.find(rec => rec.classId.toString() === classId && rec.userId.toString() === userId);
        const isAttended = attendance ? attendance.isAttended : false;
        console.log('getLiveClasses: Class:', classId, 'userId:', userId, 'isAttended:', isAttended);
        return {
          _id: classId,
          meetingLink: liveClass.meetingLink,
          scheduledDate: liveClass.scheduledDate,
          scheduledStartTime: liveClass.scheduledStartTime,
          isAttended,
        };
      }),
    };
  }

  async getLiveClassById(classId: string, userId: string): Promise<LiveClassResponseDto> {
    console.log('getLiveClassById: Starting for classId:', classId, 'userId:', userId);
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      console.log('getLiveClassById: Invalid userId format:', userId);
      throw new BadRequestException('Invalid user ID');
    }
    if (!classId || !/^[0-9a-fA-F]{24}$/.test(classId)) {
      console.log('getLiveClassById: Invalid classId format:', classId);
      throw new BadRequestException('Invalid class ID');
    }

    console.log('getLiveClassById: Fetching class:', classId);
    const liveClass = await this.liveClassesDataService.getLiveClassById(classId);
    if (!liveClass) {
      console.log('getLiveClassById: Class not found:', classId);
      throw new NotFoundException(`Live class with ID ${classId} not found`);
    }

    console.log('getLiveClassById: Fetching attendance for userId:', userId, 'classId:', classId);
    const attendance = await this.liveClassesDataService.getAttendanceForClass(userId, classId);
    const isAttended = attendance ? attendance.isAttended : false;
    console.log('getLiveClassById: Attendance:', attendance ? {
      classId: attendance.classId.toString(),
      userId: attendance.userId.toString(),
      isAttended: attendance.isAttended
    } : null, 'Final isAttended:', isAttended);

    return {
      _id: liveClass._id.toString(),
      meetingLink: liveClass.meetingLink,
      scheduledDate: liveClass.scheduledDate,
      scheduledStartTime: liveClass.scheduledStartTime,
      isAttended,
    };
  }

  async markAttendance(
    classId: string,
    userId: string,
    markAttendanceDto: MarkAttendanceDto,
  ): Promise<MarkAttendanceResponseDto> {
    console.log('markAttendance: Starting for classId:', classId, 'userId:', userId, 'data:', markAttendanceDto);
    const attendance = await this.liveClassesDataService.markAttendance(
      classId,
      userId,
      markAttendanceDto,
    );
    console.log('markAttendance: Attendance marked:', {
      _id: attendance._id.toString(),
      classId: attendance.classId.toString(),
      userId: attendance.userId.toString(),
      isAttended: attendance.isAttended
    });
    return {
      _id: attendance._id.toString(),
      classId: attendance.classId.toString(),
      userId: attendance.userId.toString(),
      isAttended: attendance.isAttended,
      createdAt: attendance.createdAt,
      updatedAt: attendance.updatedAt,
    };
  }

  async getUserAttendance(userId: string): Promise<UserAttendanceResponseDto> {
    console.log('getUserAttendance: Starting for userId:', userId);
    const attendanceData = await this.liveClassesDataService.getUserAttendance(userId);
    console.log('getUserAttendance: Attendance data:', attendanceData.map(data => ({
      classId: data.classSession._id.toString(),
      isAttended: data.attendance ? data.attendance.isAttended : false
    })));
    return {
      classes: attendanceData.map(({ classSession, attendance }) => ({
        _id: classSession._id.toString(),
        meetingLink: classSession.meetingLink,
        scheduledDate: classSession.scheduledDate,
        scheduledStartTime: classSession.scheduledStartTime,
        isAttended: attendance ? attendance.isAttended : false,
      })),
    };
  }
}
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ClassSession,
  ClassSessionDocument,
} from '../../schemas/class-session.schema';
import {
  Attendance,
  AttendanceDocument,
} from '../../schemas/attendance.schema';
import { MarkAttendanceDto } from '../../dto/live-classes.dto';

@Injectable()
export class LiveClassesDataService {
  constructor(
    @InjectModel(ClassSession.name)
    private classSessionModel: Model<ClassSessionDocument>,
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
  ) {}

  async getAttendanceForClass(userId: string, classId: string) {
    return this.attendanceModel
      .findOne({
        classId,
        userId,
      })
      .lean()
      .exec();
  }
  async getAttendanceForClasses(userId: string, classIds: string[]) {
    return this.attendanceModel
      .find({
        classId: {
          $in: classIds,
        },
        userId,
      })
      .lean()
      .exec();
  }

  async getLiveClasses(): Promise<ClassSessionDocument[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.classSessionModel
      .find({
        scheduledDate: { $gte: today },
      })
      .sort({ scheduledDate: 1, scheduledStartTime: 1 })
      .exec();
  }

  async getLiveClassById(
    classId: string,
  ): Promise<ClassSessionDocument | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const liveClass = await this.classSessionModel
      .findOne({
        _id: classId,
        scheduledDate: { $gte: today },
      })
      .exec();
    if (!liveClass) {
      throw new NotFoundException(
        `Live class with ID ${classId} not found or not scheduled`,
      );
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
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const liveClass = await this.classSessionModel
      .findOne({
        _id: classId,
        scheduledDate: { $gte: today, $lt: tomorrow },
      })
      .exec();

    if (!liveClass) {
      console.log('Query failed:', {
        classId,
        scheduledDate: { $gte: today, $lt: tomorrow },
      });
      throw new BadRequestException(
        `Live class with ID ${classId} not found or not scheduled for today`,
      );
    }

    // Skip enrollment check for now
    console.log(
      `Bypassing enrollment check for user ${userId} in class ${classId}`,
    );

    // Check if attendance already marked
    const existingAttendance = await this.attendanceModel
      .findOne({ classId, userId })
      .exec();
    if (existingAttendance) {
      throw new BadRequestException(
        `Attendance already marked for user ${userId} in class ${classId}`,
      );
    }

    const attendanceData = {
      _id: new Types.ObjectId(), // Manually generate _id
      classId: new Types.ObjectId(classId), // Ensure ObjectId type
      userId: new Types.ObjectId(userId), // Ensure ObjectId type
      isAttended: markAttendanceDto.isAttended,
    };

    console.log('attendanceData:', attendanceData);

    const newAttendance = new this.attendanceModel(attendanceData);
    return newAttendance.save();
  }

  async getUserAttendance(userId: string): Promise<
    {
      classSession: ClassSessionDocument;
      attendance: AttendanceDocument | null;
    }[]
  > {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const classSessions = await this.classSessionModel
      .find({
        scheduledDate: { $gte: today },
      })
      .sort({ scheduledDate: 1, scheduledStartTime: 1 })
      .exec();

    const attendances = await this.attendanceModel
      .find({
        userId: new Types.ObjectId(userId),
        classId: { $in: classSessions.map((session) => session._id) },
      })
      .exec();
    console.log(
      attendances,
      {
        userId,
        classId: { $in: classSessions.map((session) => session._id) },
      },
      '<====',
    );

    return classSessions.map((classSession) => {
      const attendance = attendances.find(
        (attendance) =>
          attendance.classId.toString() === classSession._id.toString(),
      );

      return {
        classSession,
        attendance: attendance || null,
      };
    });
  }
}

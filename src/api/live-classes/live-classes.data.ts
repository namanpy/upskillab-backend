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
        classId: new Types.ObjectId(classId),
        userId: new Types.ObjectId(userId),
      })
      .lean()
      .exec();
  }

  async getAttendanceForClasses(userId: string, classIds: string[]) {
    return this.attendanceModel
      .find({
        classId: {
          $in: classIds.map((id) => new Types.ObjectId(id)),
        },
        userId: new Types.ObjectId(userId),
      })
      .lean()
      .exec();
  }

  async getLiveClasses(): Promise<ClassSessionDocument[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.classSessionModel
      .find({
        // scheduledDate: { $gte: today },
      })
      .sort({ scheduledDate: 1, scheduledStartTime: 1 })
      .exec();
  }

  async getLiveClassById(
    classId: string,
  ): Promise<ClassSessionDocument | null> {
    const liveClass = await this.classSessionModel
      .findOne({
        _id: new Types.ObjectId(classId),
      })
      .exec();
    if (!liveClass) {
      throw new NotFoundException(
        `Live class with ID ${classId} not found`,
      );
    }
    return liveClass;
  }

  async markAttendance(
    classId: string,
    userId: string,
    markAttendanceDto: MarkAttendanceDto,
  ): Promise<AttendanceDocument> {
    const liveClass = await this.classSessionModel
      .findOne({ _id: new Types.ObjectId(classId) })
      .exec();

    if (!liveClass) {
      console.log('Query failed:', { classId });
      throw new BadRequestException(
        `Live class with ID ${classId} not found`,
      );
    }

    console.log(
      `Bypassing enrollment check for user ${userId} in class ${classId}`,
    );

    const existingAttendance = await this.attendanceModel
      .findOne({ classId: new Types.ObjectId(classId), userId: new Types.ObjectId(userId) })
      .exec();
    if (existingAttendance) {
      throw new BadRequestException(
        `Attendance already marked for user ${userId} in class ${classId}`,
      );
    }

    const attendanceData = {
      _id: new Types.ObjectId(),
      classId: new Types.ObjectId(classId),
      userId: new Types.ObjectId(userId),
      isAttended: markAttendanceDto.isAttended,
    };

    console.log('attendanceData:', attendanceData);
    const newAttendance = new this.attendanceModel(attendanceData);
    return newAttendance.save();
  }

  async getUserAttendance(
    input:
      | { teacherId: Types.ObjectId }
      | {
          userId: Types.ObjectId;
          batchIds: Types.ObjectId[];
        }
      | {} = {},
  ): Promise<
    {
      classSession: ClassSessionDocument;
      attendances: AttendanceDocument[] | null;
    }[]
  > {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const classSessions = await this.classSessionModel
      .find({
        // scheduledDate: { $gte: today },
        ...('teacherId' in input && { teacherId: input.teacherId }),
        ...('batchIds' in input && {
          batchId: {
            $in: (input.batchIds || []).map((b) => new Types.ObjectId(b)),
          },
        }),
      })
      .sort({ scheduledDate: 1, scheduledStartTime: 1 })
      .exec();

    const attendances = await this.attendanceModel
      .find({
        ...('userId' in input && { userId: new Types.ObjectId(input.userId) }),
        classId: { $in: classSessions.map((session) => session._id) },
      })
      .exec();

    return classSessions.map((classSession) => {
      const attendances_ = attendances.filter(
        (attendance) =>
          attendance.classId.toString() === classSession._id.toString(),
      );

      return {
        classSession,
        attendances: attendances_ || null,
      };
    });
  }

  async getAttendanceForClassAdmin(classId: string): Promise<AttendanceDocument[]> {
    return this.attendanceModel
      .find({ classId: new Types.ObjectId(classId) })
      .lean()
      .exec();
  }
}
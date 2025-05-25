import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { LiveClassesDataService } from './live-classes.data';
import {
  LiveClassesResponseDto,
  LiveClassResponseDto,
  MarkAttendanceDto,
  MarkAttendanceResponseDto,
  UserAttendanceResponseDto,
  ClassAttendanceResponseDto,
} from '../../dto/live-classes.dto';
import { ClassSessionDocument } from '../../schemas/class-session.schema';
import { AttendanceDocument } from '../../schemas/attendance.schema';
import { User } from 'src/schemas/user.schema';
import { USER_TYPES } from 'src/common/constants/user.constants';
import { TeacherDataService } from '../teachers/teacher.data';
import { OrderDataService } from '../order/order.data';
import { StudentDataService } from '../student/student.data';

@Injectable()
export class LiveClassesLogicService {
  constructor(
    private liveClassesDataService: LiveClassesDataService,
    private teacherDataService: TeacherDataService,
    private studentDataService: StudentDataService,
    private orderDataService: OrderDataService,
  ) {}

  async getLiveClasses(userId: string): Promise<LiveClassesResponseDto> {
    console.log('getLiveClasses: Starting for userId:', userId);
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      console.log('getLiveClasses: Invalid userId format:', userId);
      throw new BadRequestException('Invalid user ID');
    }

    console.log('getLiveClasses: Fetching all classes');
    const classes = await this.liveClassesDataService.getLiveClasses();
    console.log(
      'getLiveClasses: Classes found:',
      classes.map((cls) => ({
        _id: cls._id.toString(),
        scheduledDate: cls.scheduledDate.toISOString(),
      })),
    );

    console.log('getLiveClasses: Fetching attendance for userId:', userId);
    const attendanceRecords =
      await this.liveClassesDataService.getAttendanceForClasses(
        userId,
        classes.map((cls) => cls._id.toString()),
      );
    console.log(
      'getLiveClasses: Attendance records:',
      attendanceRecords.map((rec) => ({
        classId: rec.classId.toString(),
        userId: rec.userId.toString(),
        isAttended: rec.isAttended,
      })),
    );

    return {
      classes: classes.map((liveClass: ClassSessionDocument) => {
        const classId = liveClass._id;
        const attendance = attendanceRecords.find(
          (rec) =>
            rec.classId.equals(classId) && rec.userId.toString() === userId,
        );
        const isAttended = attendance ? attendance.isAttended : false;
        console.log(
          'getLiveClasses: Class:',
          classId,
          'userId:',
          userId,
          'isAttended:',
          isAttended,
        );
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

  async getLiveClassById(
    classId: string,
    userId: string,
  ): Promise<LiveClassResponseDto> {
    console.log(
      'getLiveClassById: Starting for classId:',
      classId,
      'userId:',
      userId,
    );
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      console.log('getLiveClassById: Invalid userId format:', userId);
      throw new BadRequestException('Invalid user ID');
    }
    if (!classId || !/^[0-9a-fA-F]{24}$/.test(classId)) {
      console.log('getLiveClassById: Invalid classId format:', classId);
      throw new BadRequestException('Invalid class ID');
    }

    console.log('getLiveClassById: Fetching class:', classId);
    const liveClass =
      await this.liveClassesDataService.getLiveClassById(classId);
    if (!liveClass) {
      console.log('getLiveClassById: Class not found:', classId);
      throw new NotFoundException(`Live class with ID ${classId} not found`);
    }

    console.log(
      'getLiveClassById: Fetching attendance for userId:',
      userId,
      'classId:',
      classId,
    );
    const attendance = await this.liveClassesDataService.getAttendanceForClass(
      userId,
      classId,
    );
    const isAttended = attendance ? attendance.isAttended : false;
    console.log(
      'getLiveClassById: Attendance:',
      attendance
        ? {
            classId: attendance.classId.toString(),
            userId: attendance.userId.toString(),
            isAttended: attendance.isAttended,
          }
        : null,
      'Final isAttended:',
      isAttended,
    );

    return {
      _id: liveClass._id,
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
    console.log(
      'markAttendance: Starting for classId:',
      classId,
      'userId:',
      userId,
      'data:',
      markAttendanceDto,
    );
    const attendance = await this.liveClassesDataService.markAttendance(
      classId,
      userId,
      markAttendanceDto,
    );
    console.log('markAttendance: Attendance marked:', {
      _id: attendance._id.toString(),
      classId: attendance.classId.toString(),
      userId: attendance.userId.toString(),
      isAttended: attendance.isAttended,
    });
    return {
      _id: attendance._id,
      classId: attendance.classId,
      userId: attendance.userId,
      isAttended: attendance.isAttended,
      createdAt: attendance.createdAt,
      updatedAt: attendance.updatedAt,
    };
  }

  async getUserAttendance(user: User): Promise<UserAttendanceResponseDto> {
    const userId = user._id.toString();
    const teacherId =
      user.userType === USER_TYPES.TEACHER
        ? await this.teacherDataService
            .getTeacherByUserId(userId)
            .then((t) => t?._id)
        : undefined;

    let batchIds: string[] = [];

    if (user.userType === USER_TYPES.STUDENT) {
      const orders = await this.orderDataService.getOrdersByUser(
        userId.toString(),
      );
      console.log(orders)
      batchIds = orders
      .filter((order)=>order.status==="COMPLETED")
      .map((order) => {
  console.log(order);
  return order.batch._id.toString(); // Must return the value
});
    }

    const attendanceData = await this.liveClassesDataService.getUserAttendance(
      user.userType === USER_TYPES.STUDENT
        ? {
            userId,
            batchIds,
          }
        : user.userType === USER_TYPES.TEACHER
          ? {
              teacherId,
            }
          : {},
    );

    return {
      classes: await Promise.all(
        attendanceData.map(async ({ classSession, attendances }) => {
          if (
            user.userType === USER_TYPES.TEACHER ||
            user.userType === USER_TYPES.ADMIN
          ) {
            const student = !!attendances?.at(0)?.userId
              ? await this.studentDataService.getStudentByUserId(
                  attendances?.at(0)?.userId!,
                )
              : undefined;

            const teacher = classSession?.teacherId
              ? await this.teacherDataService.getTeacherById(
                  classSession.teacherId,
                )
              : undefined;

            return {
              _id: classSession._id,
              meetingLink: classSession.meetingLink,
              scheduledDate: classSession.scheduledDate,
              scheduledStartTime: classSession.scheduledStartTime,
              students: await Promise.all(
                attendances?.map(async (attendance) => ({
                  _id: attendance.userId,
                  student: await this.studentDataService.getStudentByUserId(
                    attendance.userId,
                  ),
                  isAttended: attendance.isAttended,
                })) || [],
              ),
              teacher,
            };
          } else {
            const teacher = classSession?.teacherId
              ? await this.teacherDataService.getTeacherById(
                  classSession.teacherId,
                )
              : undefined;

            return {
              _id: classSession._id,
              meetingLink: classSession.meetingLink,
              scheduledDate: classSession.scheduledDate,
              scheduledStartTime: classSession.scheduledStartTime,
              isAttended: !!attendances?.at(0)?.isAttended,
              teacher,
            };
          }
        }),
      ),
    };
  }

  async getClassAttendance(
    classId: string,
    user: User,
  ): Promise<ClassAttendanceResponseDto> {
    console.log('getClassAttendance: Starting for classId:', classId, 'userId:', user._id.toString());
    
    if (user.userType !== USER_TYPES.TEACHER) {
      console.log('getClassAttendance: User is not admin:', user._id.toString());
      throw new ForbiddenException('Only admins can access class attendance');
    }

    if (!classId || !/^[0-9a-fA-F]{24}$/.test(classId)) {
      console.log('getClassAttendance: Invalid classId format:', classId);
      throw new BadRequestException('Invalid class ID');
    }

    console.log('getClassAttendance: Fetching class:', classId);
    const liveClass = await this.liveClassesDataService.getLiveClassById(classId);
    if (!liveClass) {
      console.log('getClassAttendance: Class not found:', classId);
      throw new NotFoundException(`Live class with ID ${classId} not found`);
    }

    console.log('getClassAttendance: Fetching attendance for classId:', classId);
    const attendanceRecords = await this.liveClassesDataService.getAttendanceForClassAdmin(classId);
    console.log(
      'getClassAttendance: Attendance records:',
      attendanceRecords.map((rec) => ({
        userId: rec.userId.toString(),
        isAttended: rec.isAttended,
      })),
    );

    const students = await Promise.all(
      attendanceRecords
        .filter((rec) => rec.isAttended) // Only include students who attended
        .map(async (rec) => {
          const student = await this.studentDataService.getStudentByUserId(rec.userId);
          return {
            userId: rec.userId,
            isAttended: rec.isAttended,
            name: student ? student.fullName : 'Unknown',
          };
        }),
    );

    const totalAttended = students.length; // Since we filtered by isAttended: true

    return {
      _id: liveClass._id,
      meetingLink: liveClass.meetingLink,
      scheduledDate: liveClass.scheduledDate,
      scheduledStartTime: liveClass.scheduledStartTime,
      totalAttended,
      students,
    };
  }
}
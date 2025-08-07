import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ClassSessionDataService } from './class-session.data';
import {
  CreateClassSessionDto,
  UpdateClassSessionDto,
  GetClassSessionsResponseDTO,
  ClassSession,
} from '../../dto/class-session.dto';
import { ClassSessionDocument } from '../../schemas/class-session.schema';
import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';
import { BatchDataService } from '../batch/batch.data';
import { OrderDataService } from '../order/order.data';
import { USER_TYPES } from '../../common/constants/user.constants';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import { TeacherDataService } from '../teachers/teacher.data';
import { EnrollmentDataService } from '../enrollment/enrollment.data';
import { ScheduleMeetingService } from '../schedule-meeting/schedule-meeting.service';
import { OrderLogicService } from '../order/order.logic';

// import { log } from 'console';
@Injectable()
export class ClassSessionLogicService {
  constructor(
    private classSessionDataService: ClassSessionDataService,
    private batchDataService: BatchDataService,
    private orderDataService: OrderDataService,
    private teacherDataService: TeacherDataService,
    private enrollmentDataService: EnrollmentDataService,
    private readonly scheduleMeetingService: ScheduleMeetingService,
    private  OrderLogicService: OrderLogicService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async mapToDto(session: ClassSessionDocument): Promise<ClassSession> {
  await session.populate('batchIds');
  await session.populate('teacherId');

  const batchIds = Array.isArray(session.batchIds)
    ? session.batchIds.map((batch: any) => batch._id.toString())
    : [];

  const teacherName = session.teacherId
    ? (session.teacherId as any).username
    : '';
  const dto = mapToDto<ClassSession, ClassSessionDocument>(session);

  return {
    ...dto,
    batchIds
  };
}



  // private async mapToDtoArray(
  //   sessions: ClassSessionDocument[],
  // ): Promise<ClassSession[]> {
  //   const populatedSessions = await Promise.all(
  //     sessions.map(async (session) => {
  //       await session.populate('batchId');
  //       await session.populate('teacherId');
  //       return session;
  //     }),
  //   );

  //   return populatedSessions.map((session) => {
  //     const batchName = session.batchId ? (session.batchId as any).name : '';
  //     const teacherName = session.teacherId
  //       ? (session.teacherId as any).username
  //       : '';
  //     const dto = mapToDto<ClassSession, ClassSessionDocument>(session);
  //     return { ...dto, batchName, teacherName };
  //   });
  // }

  // For Admins: Get all sessions
 
//   async getClassSessions(user: any): Promise<GetClassSessionsResponseDTO> {
//     if (user.userType !== USER_TYPES.ADMIN) {
//       throw new ForbiddenException('Only admins can access all class sessions');
//     }
//     const sessions = await this.classSessionDataService.getClassSessions();
//     return {
//       classSessions: sessions.map((s) => ({
//   ...s,
//   _id: s._id.toString(),
//   batchIds: s.batchIds.map((b: any) => b._id.toString()), // convert Batch[] -> string[]
// }))
//     };
//   }

// async getClassSessions(user: any): Promise<GetClassSessionsResponseDTO> {
//   if (user.userType !== USER_TYPES.ADMIN) {
//     throw new ForbiddenException('Only admins can access all class sessions');
//   }

//   const sessions = await this.classSessionDataService.getClassSessions();

//   return {
//     classSessions: sessions.map((s) => {
//       // Support both old `batchId` and new `batchIds`
//       let batchIds: string[];

//       if ('batchIds' in s && Array.isArray(s.batchIds)) {
//         batchIds = s.batchIds.map((b: any) =>
//           typeof b === 'string' ? b : b._id.toString(),
//         );
//       } else if ('batchId' in s && s.batchId) {
//         batchIds = [s.batchId.toString()];
//       } else {
//         batchIds = [];
//       }

//       return {
//         ...s,
//         _id: s._id.toString(),
//         batchIds,
//       };
//     }),
//   };
// }

async getClassSessions(user: any) {
  if (user.userType !== USER_TYPES.ADMIN) {
    throw new ForbiddenException('Only admins can access all class sessions');
  }

  const sessions = await this.classSessionDataService.getClassSessions();

  return {
    classSessions: sessions.map((s) => ({
      ...s,
      _id: s._id.toString(),
      teacherId: s.teacherId
        ? {
            ...s.teacherId,
            _id: s.teacherId._id?.toString(),
          }
        : null,
      batchIds: Array.isArray(s.batchIds)
        ? s.batchIds.map((batch: any) => ({
            ...batch,
            _id: batch._id?.toString?.() ?? batch._id,
          }))
        : [],
    })),
  };
}




  // For Students: Get sessions for enrolled batches

 async getStudentClassSessions(
  user: any,
): Promise<GetClassSessionsResponseDTO> {
  if (user.userType !== USER_TYPES.STUDENT) {
    throw new ForbiddenException(
      'Only students can access their class sessions',
    );
  }

  const enrollment = await this.enrollmentDataService.getEnrollmentByUserId(
    user._id,
  );
  const batchIds = enrollment.order.map((order) => order.batch._id);

  const sessions =
    await this.classSessionDataService.getClassSessionsByBatches(
      batchIds,
      true,
    );

  return {
    classSessions: sessions.map((s) => ({
      ...s,
      _id: s._id.toString(),
      batchIds: Array.isArray(s.batchIds)
        ? s.batchIds.map((b: any) => b._id?.toString?.() ?? b?.toString?.())
        : [],
    })),
  };
}



  // For Teachers: Get sessions for their batches
  async getTeacherClassSessions(
    user: User,
  ): Promise<GetClassSessionsResponseDTO> {
    if (user.userType !== USER_TYPES.TEACHER) {
      throw new ForbiddenException(
        'Only teachers can access their class sessions',
      );
    }

    const teacher = await this.teacherDataService.getTeacherByUserId(user._id);
    if (!teacher) {
      throw new ForbiddenException('Teacher not found');
    }

    const sessions =
      await this.classSessionDataService.getClassSessionsByTeacher(teacher._id);
    return {
      classSessions: sessions.map((s) => ({ ...s, _id: s._id.toString() })),
    };
  }

  // For Admins: Create session directly (approved)
  async createClassSession(createClassSessionDto: CreateClassSessionDto, user: any) {
    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('Only admins can create class sessions directly');
    }
    const teacher = await this.teacherDataService.getTeacherById(createClassSessionDto.teacherId);
    if (!teacher) {
      throw new BadRequestException(`Teacher with ID ${createClassSessionDto.teacherId} not found`);
    }
    
    // const students = await this.OrderLogicService.getOrderByBatchId(createClassSessionDto.batchId)
    // const studentEmails = students.map(order => order.user?.email)  
    //   .filter(email => !!email);   
    let allOrders: any[] = [];
for (const batchId of createClassSessionDto.batchIds) {
  const batch = await this.batchDataService.getBatchById(batchId);
  if (!batch) {
    throw new BadRequestException(`Batch with IDs ${batchId} not found`);
  }

  const orders = await this.OrderLogicService.getOrderByBatchId(batchId);
  allOrders = allOrders.concat(orders);
}

// ✅ Extract all student emails from all orders
const studentEmails = allOrders
  .map(order => order.user?.email)
  .filter((email): email is string => !!email);

    // Validate timing
    const startTime = this.parseTime(createClassSessionDto.scheduledStartTime);
    const endTime = this.parseTime(createClassSessionDto.scheduledEndTime);
    if (endTime <= startTime) {
      throw new BadRequestException('End time must be after start time');
    }

    const scheduledDateTime = new Date(`${createClassSessionDto.scheduledDate}T${createClassSessionDto.scheduledStartTime}:00Z`);
    const now = new Date();
    if (scheduledDateTime <= now) {
      throw new BadRequestException('Scheduled date and time must be in the future');
    }

    const conflict = await this.classSessionDataService.checkTeacherConflict(
      createClassSessionDto.teacherId,
      new Date(createClassSessionDto.scheduledDate),
      createClassSessionDto.scheduledStartTime,
      createClassSessionDto.scheduledEndTime,
    );
    if (conflict) {
      throw new BadRequestException('Teacher is already scheduled for this time');
    }

    // 🔹 If Google Meet, auto-generate meeting link
    if (createClassSessionDto.meetingPlatform === 'google_meet') {
  const startISO = `${createClassSessionDto.scheduledDate}T${createClassSessionDto.scheduledStartTime}:00+05:30`;
  const endISO = `${createClassSessionDto.scheduledDate}T${createClassSessionDto.scheduledEndTime}:00+05:30`;

  // ✅ Ensure teacher email is string
  const teacherEmail: string = teacher.user?.email || '';
  if (!teacherEmail) {
    throw new BadRequestException('Teacher does not have a valid email');
  }

  // ✅ Filter out undefined/null from student emails
  const validStudentEmails: string[] = (studentEmails || []).filter(
    (email): email is string => !!email
  );

  const meeting = await this.scheduleMeetingService.createMeeting({
    summary: createClassSessionDto.title,
    description: createClassSessionDto.description || '',
    startTime: startISO,
    endTime: endISO,
    teacherEmail: teacherEmail,
    studentEmails: validStudentEmails,
  });

  // ✅ Ensure meetingLink is string
  createClassSessionDto.meetingLink = meeting.meetLink || '';
}


    // Save to DB
    const sessionData = { ...createClassSessionDto, isApproved: true };
    const session = await this.classSessionDataService.createClassSession(sessionData);

    return {
      classSession: await this.mapToDto(session),
    };
  }

  // For Admins: Approve a session
  async approveClassSession(id: string, user: any) {
    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('Only admins can approve class sessions');
    }

    const session = await this.classSessionDataService.getClassSessionById(id);
    if (!session) {
      throw new NotFoundException(`Class session with ID ${id} not found`);
    }

    if (session.isApproved) {
      throw new BadRequestException('Class session is already approved');
    }

    const updatedSession =
      await this.classSessionDataService.updateClassSession(id, {
        isApproved: true,
      });
    if (!updatedSession) {
      throw new NotFoundException(`Class session with ID ${id} not found`);
    }

    return {
      classSession: updatedSession
    };
  }

  async getClassSessionById(id: string, user: User) {
    const session = await this.classSessionDataService.getClassSessionById(id);
    if (!session) {
      throw new NotFoundException(`Class session with ID ${id} not found`);
    }

    if (
      user.userType === USER_TYPES.TEACHER &&
      session.teacherId.toString() !== user._id.toString()
    ) {
      throw new ForbiddenException(
        'You can only access your own class sessions',
      );
    }

    if (user.userType === USER_TYPES.STUDENT) {
      const orders = await this.orderDataService.getOrdersByUser(
        user._id.toString(),
      );
      const batchIds = orders.map((order) => order?.batch?.toString());
      const sessionBatchIds = session.batchIds.map((id: any) =>
  typeof id === 'string' ? id : id._id?.toString()
);

const isEnrolled = sessionBatchIds.some((id) => batchIds.includes(id));

if (!isEnrolled) {
  throw new ForbiddenException('You are not enrolled in this batch');
}
      if (!session.isApproved) {
        throw new ForbiddenException('This class session is not yet approved');
      }
    }

    return {
      classSession: await this.mapToDto(session),
    };
  }

async updateClassSession(
  id: string,
  updateClassSessionDto: UpdateClassSessionDto,
  user: any,
) {
  const session = await this.classSessionDataService.getClassSessionById(id);
  if (!session) {
    throw new NotFoundException(`Class session with ID ${id} not found`);
  }

  if (user.userType === USER_TYPES.TEACHER) {
    if (session.teacherId.toString() !== user._id) {
      throw new ForbiddenException('You can only update your own class sessions');
    }

    const allowedFields: Partial<UpdateClassSessionDto> = {
      recordingUrl: updateClassSessionDto.recordingUrl,
    };

    const updatedSession = await this.classSessionDataService.updateClassSession(id, allowedFields);
    if (!updatedSession) {
      throw new NotFoundException(`Class session with ID ${id} not found`);
    }

    return {
      classSession: await this.mapToDto(updatedSession),
    };
  }

  if (user.userType !== USER_TYPES.ADMIN) {
    throw new ForbiddenException('Only admins can update class sessions');
  }

  // ✅ Validate all batch IDs
  if (updateClassSessionDto.batchIds && updateClassSessionDto.batchIds.length) {
    for (const batchId of updateClassSessionDto.batchIds) {
      const batch = await this.batchDataService.getBatchById(batchId);
      if (!batch) {
        throw new BadRequestException(`Batch with ID ${batchId} not found`);
      }
    }
  }

  // ✅ Validate teacher if provided
  if (updateClassSessionDto.teacherId) {
    const teacher = await this.teacherDataService.getTeacherById(updateClassSessionDto.teacherId);
    if (!teacher) {
      throw new BadRequestException(`Teacher with ID ${updateClassSessionDto.teacherId} not found`);
    }
  }

  // ✅ Validate scheduling if provided
  if (
    updateClassSessionDto.scheduledDate ||
    updateClassSessionDto.scheduledStartTime ||
    updateClassSessionDto.scheduledEndTime
  ) {
    const now = new Date();

    const scheduledDate = updateClassSessionDto.scheduledDate
      ? new Date(updateClassSessionDto.scheduledDate)
      : session.scheduledDate;

    const startTime = updateClassSessionDto.scheduledStartTime || session.scheduledStartTime;
    const endTime = updateClassSessionDto.scheduledEndTime || session.scheduledEndTime;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startDateTime = new Date(
      scheduledDate.getFullYear(),
      scheduledDate.getMonth(),
      scheduledDate.getDate(),
      startHour,
      startMinute,
      0,
    );

    const endDateTime = new Date(
      scheduledDate.getFullYear(),
      scheduledDate.getMonth(),
      scheduledDate.getDate(),
      endHour,
      endMinute,
      0,
    );

    if (scheduledDate.toDateString() === now.toDateString() && startDateTime <= now) {
      throw new BadRequestException('Start time must be in the future for today');
    }

    if (scheduledDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      throw new BadRequestException('Scheduled date must be today or in the future');
    }

    if (endDateTime <= startDateTime) {
      throw new BadRequestException('End time must be after start time');
    }

    const teacherId = updateClassSessionDto.teacherId || session.teacherId.toString();
    const conflict = await this.classSessionDataService.checkTeacherConflict(
      teacherId,
      scheduledDate,
      startTime,
      endTime,
      id,
    );

    if (conflict) {
      throw new BadRequestException('Teacher is already scheduled for this time');
    }
  }

  const updatedSession = await this.classSessionDataService.updateClassSession(
    id,
    updateClassSessionDto,
  );

  if (!updatedSession) {
    throw new NotFoundException(`Class session with ID ${id} not found`);
  }

  return {
    classSession: updatedSession,
  };
}

  
  

  async deleteClassSession(id: string, user: any) {
    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('Only admins can delete class sessions');
    }

    const session = await this.classSessionDataService.deleteClassSession(id);
    if (!session) {
      throw new NotFoundException(`Class session with ID ${id} not found`);
    }
    return { message: 'Class session deleted successfully' };
  }

  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

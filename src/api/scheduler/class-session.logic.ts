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
// import { log } from 'console';

@Injectable()
export class ClassSessionLogicService {
  constructor(
    private classSessionDataService: ClassSessionDataService,
    private batchDataService: BatchDataService,
    private orderDataService: OrderDataService,
    private teacherDataService: TeacherDataService,
    private enrollmentDataService: EnrollmentDataService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async mapToDto(session: ClassSessionDocument): Promise<ClassSession> {
    await session.populate('batchId');
    await session.populate('teacherId');

    const batchName = session.batchId ? (session.batchId as any).name : '';
    const teacherName = session.teacherId
      ? (session.teacherId as any).username
      : '';
    const dto = mapToDto<ClassSession, ClassSessionDocument>(session);
    return { ...dto };
  }

  private async mapToDtoArray(
    sessions: ClassSessionDocument[],
  ): Promise<ClassSession[]> {
    const populatedSessions = await Promise.all(
      sessions.map(async (session) => {
        await session.populate('batchId');
        await session.populate('teacherId');
        return session;
      }),
    );

    return populatedSessions.map((session) => {
      const batchName = session.batchId ? (session.batchId as any).name : '';
      const teacherName = session.teacherId
        ? (session.teacherId as any).username
        : '';
      const dto = mapToDto<ClassSession, ClassSessionDocument>(session);
      return { ...dto, batchName, teacherName };
    });
  }

  // For Admins: Get all sessions
  async getClassSessions(user: any): Promise<GetClassSessionsResponseDTO> {
    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException('Only admins can access all class sessions');
    }
    const sessions = await this.classSessionDataService.getClassSessions();
    return {
      classSessions: sessions.map((s) => ({ ...s, _id: s._id.toString() })),
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
    console.log('====================================');
    console.log(user);
    console.log('====================================');
    // console.log(getStudentClassSessions)
    // Find orders for the student to get enrolled batches
    const enrollment = await this.enrollmentDataService.getEnrollmentByUserId(
      user._Id,
    );
    const batchIds = enrollment.order.map((order) => order.batch._id);
    console.log('====================================');
    console.log(enrollment);
    console.log(batchIds);
    console.log('====================================');

    // Get approved sessions for those batches
    const sessions =
      await this.classSessionDataService.getClassSessionsByBatches(
        batchIds,
        true,
      );
    return {
      classSessions: sessions.map((s) => ({ ...s, _id: s._id.toString() })),
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
  async createClassSession(
    createClassSessionDto: CreateClassSessionDto,
    user: any,
  ) {
    if (user.userType !== USER_TYPES.ADMIN) {
      throw new ForbiddenException(
        'Only admins can create class sessions directly',
      );
    }

    const batch = await this.batchDataService.getBatchById(
      createClassSessionDto.batchId,
    );
    if (!batch) {
      throw new BadRequestException(
        `Batch with ID ${createClassSessionDto.batchId} not found`,
      );
    }

    const teacher = await this.teacherDataService.getTeacherById(
      createClassSessionDto.teacherId,
    );

    if (!teacher) {
      throw new BadRequestException(
        `Teacher with ID ${createClassSessionDto.teacherId} not found`,
      );
    }

    const scheduledDate = new Date(createClassSessionDto.scheduledDate);
    if (scheduledDate < new Date()) {
      throw new BadRequestException('Scheduled date must be in the future');
    }

    const startTime = this.parseTime(createClassSessionDto.scheduledStartTime);
    const endTime = this.parseTime(createClassSessionDto.scheduledEndTime);
    if (endTime <= startTime) {
      throw new BadRequestException('End time must be after start time');
    }

    const conflict = await this.classSessionDataService.checkTeacherConflict(
      createClassSessionDto.teacherId,
      scheduledDate,
      createClassSessionDto.scheduledStartTime,
      createClassSessionDto.scheduledEndTime,
    );
    if (conflict) {
      throw new BadRequestException(
        'Teacher is already scheduled for this time',
      );
    }

    const sessionData = { ...createClassSessionDto, isApproved: true };
    const session =
      await this.classSessionDataService.createClassSession(sessionData);
    return {
      classSession: await this.mapToDto(session),
    };
  }

  // For Teachers: Create session (pending approval)
  async createTeacherClassSession(
    createClassSessionDto: CreateClassSessionDto,
    user: User,
  ) {
    if (user.userType !== USER_TYPES.TEACHER) {
      throw new ForbiddenException('Only teachers can create class sessions');
    }

    const batch = await this.batchDataService.getBatchById(
      createClassSessionDto.batchId,
    );
    if (!batch) {
      throw new BadRequestException(
        `Batch with ID ${createClassSessionDto.batchId} not found`,
      );
    }

    const teacher = await this.teacherDataService.getTeacherByUserId(user._id);
    // Check if teacher is assigned to the batch
    if (!teacher || !batch.teacher._id.equals(teacher._id)) {
      throw new ForbiddenException(
        'You can only schedule sessions for your assigned batches',
      );
    }
    // console.log(createClassSessionDto, teacher);
    // Ensure teacherId matches the authenticated teacher
    if (createClassSessionDto.teacherId !== teacher._id.toString()) {
      throw new BadRequestException(
        'Teacher ID must match the authenticated teacher',
      );
    }

    const scheduledDate = new Date(createClassSessionDto.scheduledDate);
    if (scheduledDate < new Date()) {
      throw new BadRequestException('Scheduled date must be in the future');
    }

    const startTime = this.parseTime(createClassSessionDto.scheduledStartTime);
    const endTime = this.parseTime(createClassSessionDto.scheduledEndTime);
    if (endTime <= startTime) {
      throw new BadRequestException('End time must be after start time');
    }

    const conflict = await this.classSessionDataService.checkTeacherConflict(
      createClassSessionDto.teacherId,
      scheduledDate,
      createClassSessionDto.scheduledStartTime,
      createClassSessionDto.scheduledEndTime,
    );
    if (conflict) {
      throw new BadRequestException(
        'Teacher is already scheduled for this time',
      );
    }

    const sessionData = { ...createClassSessionDto, isApproved: false };
    const session =
      await this.classSessionDataService.createClassSession(sessionData);
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
      classSession: await this.mapToDto(updatedSession),
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
      const batchIds = orders.map((order) => order.batch.toString());
      if (!batchIds.includes(session.batchId.toString())) {
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
      if (session.teacherId.toString() !== user.userId) {
        throw new ForbiddenException(
          'You can only update your own class sessions',
        );
      }
      const allowedFields: Partial<UpdateClassSessionDto> = {
        recordingUrl: updateClassSessionDto.recordingUrl,
      };
      const updatedSession =
        await this.classSessionDataService.updateClassSession(
          id,
          allowedFields,
        );
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

    if (updateClassSessionDto.batchId) {
      const batch = await this.batchDataService.getBatchById(
        updateClassSessionDto.batchId,
      );
      if (!batch) {
        throw new BadRequestException(
          `Batch with ID ${updateClassSessionDto.batchId} not found`,
        );
      }
    }

    if (updateClassSessionDto.teacherId) {
      const teacher = await this.userModel
        .findOne({
          _id: updateClassSessionDto.teacherId,
          userType: USER_TYPES.TEACHER,
        })
        .exec();
      if (!teacher) {
        throw new BadRequestException(
          `Teacher with ID ${updateClassSessionDto.teacherId} not found`,
        );
      }
    }

    if (
      updateClassSessionDto.scheduledDate ||
      updateClassSessionDto.scheduledStartTime ||
      updateClassSessionDto.scheduledEndTime
    ) {
      const scheduledDate = updateClassSessionDto.scheduledDate
        ? new Date(updateClassSessionDto.scheduledDate)
        : session.scheduledDate;
      const startTime =
        updateClassSessionDto.scheduledStartTime || session.scheduledStartTime;
      const endTime =
        updateClassSessionDto.scheduledEndTime || session.scheduledEndTime;

      if (scheduledDate < new Date()) {
        throw new BadRequestException('Scheduled date must be in the future');
      }

      const parsedStartTime = this.parseTime(startTime);
      const parsedEndTime = this.parseTime(endTime);
      if (parsedEndTime <= parsedStartTime) {
        throw new BadRequestException('End time must be after start time');
      }

      const teacherId =
        updateClassSessionDto.teacherId || session.teacherId.toString();
      const conflict = await this.classSessionDataService.checkTeacherConflict(
        teacherId,
        scheduledDate,
        startTime,
        endTime,
        id,
      );
      if (conflict) {
        throw new BadRequestException(
          'Teacher is already scheduled for this time',
        );
      }
    }

    const updatedSession =
      await this.classSessionDataService.updateClassSession(
        id,
        updateClassSessionDto,
      );
    if (!updatedSession) {
      throw new NotFoundException(`Class session with ID ${id} not found`);
    }
    return {
      classSession: await this.mapToDto(updatedSession),
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

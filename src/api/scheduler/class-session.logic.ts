// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { ClassSessionDataService } from './class-session.data';
// import { CreateClassSessionDto, UpdateClassSessionDto, GetClassSessionsResponseDTO, ClassSession } from '../../dto/class-session.dto';
// import { ClassSessionDocument } from '../../schemas/class-session.schema';
// import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';
// import { BatchDataService } from '../batch/batch.data';
// import { CourseDataService } from '../course/course.data';
// import { TeacherDataService } from '../teachers/teacher.data';
// import { User } from '../../common/decorators/user.decorator';
// import { GetCourseDisplayRequestDto } from 'src/dto/course/course.dto';

// @Injectable()
// export class ClassSessionLogicService {
//   constructor(
//     private classSessionDataService: ClassSessionDataService,
//     private batchDataService: BatchDataService,
//     private courseDataService: CourseDataService,
//     private teacherDataService: TeacherDataService,
//   ) {}

//   private async mapToDto(session: ClassSessionDocument): Promise<ClassSession> {
//     // Await each populate operation separately
//     await session.populate('batchId');
//     await session.populate('courseId');
//     await session.populate('teacherId');
    
//     const batchName = session.batchId ? (session.batchId as any).name : '';
//     const courseName = session.courseId ? (session.courseId as any).courseName : '';
//     const teacherName = session.teacherId ? (session.teacherId as any).name : '';
//     const dto = mapToDto<ClassSession, ClassSessionDocument>(session);
//     return { ...dto, batchName, courseName, teacherName };
//   }

//   private async mapToDtoArray(sessions: ClassSessionDocument[]): Promise<ClassSession[]> {
//     // Populate each session individually
//     const populatedSessions = await Promise.all(
//       sessions.map(async session => {
//         await session.populate('batchId');
//         await session.populate('courseId');
//         await session.populate('teacherId');
//         return session;
//       }),
//     );
    
//     return populatedSessions.map(session => {
//       const batchName = session.batchId ? (session.batchId as any).name : '';
//       const courseName = session.courseId ? (session.courseId as any).courseName : '';
//       const teacherName = session.teacherId ? (session.teacherId as any).name : '';
//       const dto = mapToDto<ClassSession, ClassSessionDocument>(session);
//       return { ...dto, batchName, courseName, teacherName };
//     });
//   }

//   async getClassSessions(user: any): Promise<GetClassSessionsResponseDTO> {
//     let sessions: ClassSessionDocument[];
//     if (user.role === 'teacher') {
//       sessions = await this.classSessionDataService.getClassSessionsByTeacher(user.teacherId);
//     } else {
//       sessions = await this.classSessionDataService.getClassSessions();
//     }
//     return {
//       classSessions: await this.mapToDtoArray(sessions),
//     };
//   }

//   async createClassSession(createClassSessionDto: CreateClassSessionDto) {
//     // Validate foreign keys
//     const batch = await this.batchDataService.getBatchById(createClassSessionDto.batchId);
//     if (!batch) {
//       throw new BadRequestException(`Batch with ID ${createClassSessionDto.batchId} not found`);
//     }

//     // Use getCourse to validate courseId
//     const courseQuery: GetCourseDisplayRequestDto = { search: createClassSessionDto.courseId };
//     const courseResult = await this.courseDataService.getCourse(courseQuery);
//     const course = courseResult.data.find(c => c._id.toString() === createClassSessionDto.courseId);
//     if (!course) {
//       throw new BadRequestException(`Course with ID ${createClassSessionDto.courseId} not found`);
//     }

//     const teacher = await this.teacherDataService.getTeacherById(createClassSessionDto.teacherId);
//     if (!teacher) {
//       throw new BadRequestException(`Teacher with ID ${createClassSessionDto.teacherId} not found`);
//     }

//     // Validate date and time
//     const scheduledDate = new Date(createClassSessionDto.scheduledDate);
//     if (scheduledDate < new Date()) {
//       throw new BadRequestException('Scheduled date must be in the future');
//     }

//     const startTime = this.parseTime(createClassSessionDto.scheduledStartTime);
//     const endTime = this.parseTime(createClassSessionDto.scheduledEndTime);
//     if (endTime <= startTime) {
//       throw new BadRequestException('End time must be after start time');
//     }

//     // Check for teacher conflict
//     const conflict = await this.classSessionDataService.checkTeacherConflict(
//       createClassSessionDto.teacherId,
//       scheduledDate,
//       createClassSessionDto.scheduledStartTime,
//       createClassSessionDto.scheduledEndTime,
//     );
//     if (conflict) {
//       throw new BadRequestException('Teacher is already scheduled for this time');
//     }

//     const session = await this.classSessionDataService.createClassSession(createClassSessionDto);
//     return {
//       classSession: await this.mapToDto(session),
//     };
//   }

//   async getClassSessionById(id: string, user: any) {
//     const session = await this.classSessionDataService.getClassSessionById(id);
//     if (!session) {
//       throw new NotFoundException(`Class session with ID ${id} not found`);
//     }

//     if (user.role === 'teacher' && session.teacherId.toString() !== user.teacherId) {
//       throw new BadRequestException('You can only access your own class sessions');
//     }

//     return {
//       classSession: await this.mapToDto(session),
//     };
//   }

//   async updateClassSession(id: string, updateClassSessionDto: UpdateClassSessionDto, user: any) {
//     const session = await this.classSessionDataService.getClassSessionById(id);
//     if (!session) {
//       throw new NotFoundException(`Class session with ID ${id} not found`);
//     }

//     if (user.role === 'teacher') {
//       if (session.teacherId.toString() !== user.teacherId) {
//         throw new BadRequestException('You can only update your own class sessions');
//       }
//       // Teachers can only update recordingUrl
//       const allowedFields: Partial<UpdateClassSessionDto> = {
//         recordingUrl: updateClassSessionDto.recordingUrl,
//       };
//       const updatedSession = await this.classSessionDataService.updateClassSession(id, allowedFields);
//       if (!updatedSession) {
//         throw new NotFoundException(`Class session with ID ${id} not found`);
//       }
//       return {
//         classSession: await this.mapToDto(updatedSession),
//       };
//     }

//     // Admin validations
//     if (updateClassSessionDto.batchId) {
//       const batch = await this.batchDataService.getBatchById(updateClassSessionDto.batchId);
//       if (!batch) {
//         throw new BadRequestException(`Batch with ID ${updateClassSessionDto.batchId} not found`);
//       }
//     }

//     if (updateClassSessionDto.courseId) {
//       const courseQuery: GetCourseDisplayRequestDto = { search: updateClassSessionDto.courseId };
//       const courseResult = await this.courseDataService.getCourse(courseQuery);
//       const course = courseResult.data.find(c => c._id.toString() === updateClassSessionDto.courseId);
//       if (!course) {
//         throw new BadRequestException(`Course with ID ${updateClassSessionDto.courseId} not found`);
//       }
//     }

//     if (updateClassSessionDto.teacherId) {
//       const teacher = await this.teacherDataService.getTeacherById(updateClassSessionDto.teacherId);
//       if (!teacher) {
//         throw new BadRequestException(`Teacher with ID ${updateClassSessionDto.teacherId} not found`);
//       }
//     }

//     if (updateClassSessionDto.scheduledDate || updateClassSessionDto.scheduledStartTime || updateClassSessionDto.scheduledEndTime) {
//       const scheduledDate = updateClassSessionDto.scheduledDate
//         ? new Date(updateClassSessionDto.scheduledDate)
//         : session.scheduledDate;
//       const startTime = updateClassSessionDto.scheduledStartTime || session.scheduledStartTime;
//       const endTime = updateClassSessionDto.scheduledEndTime || session.scheduledEndTime;

//       if (scheduledDate < new Date()) {
//         throw new BadRequestException('Scheduled date must be in the future');
//       }

//       const parsedStartTime = this.parseTime(startTime);
//       const parsedEndTime = this.parseTime(endTime);
//       if (parsedEndTime <= parsedStartTime) {
//         throw new BadRequestException('End time must be after start time');
//       }

//       const teacherId = updateClassSessionDto.teacherId || session.teacherId.toString();
//       const conflict = await this.classSessionDataService.checkTeacherConflict(
//         teacherId,
//         scheduledDate,
//         startTime,
//         endTime,
//         id,
//       );
//       if (conflict) {
//         throw new BadRequestException('Teacher is already scheduled for this time');
//       }
//     }

//     const updatedSession = await this.classSessionDataService.updateClassSession(id, updateClassSessionDto);
//     if (!updatedSession) {
//       throw new NotFoundException(`Class session with ID ${id} not found`);
//     }
//     return {
//       classSession: await this.mapToDto(updatedSession),
//     };
//   }

//   async deleteClassSession(id: string) {
//     const session = await this.classSessionDataService.deleteClassSession(id);
//     if (!session) {
//       throw new NotFoundException(`Class session with ID ${id} not found`);
//     }
//     return { message: 'Class session deleted successfully' };
//   }

//   private parseTime(time: string): number {
//     const [hours, minutes] = time.split(':').map(Number);
//     return hours * 60 + minutes;
//   }
// }


import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ClassSessionDataService } from './class-session.data';
import { CreateClassSessionDto, UpdateClassSessionDto, GetClassSessionsResponseDTO, ClassSession } from '../../dto/class-session.dto';
import { ClassSessionDocument } from '../../schemas/class-session.schema';
import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';
import { BatchDataService } from '../batch/batch.data';
import { TeacherDataService } from '../teachers/teacher.data';
import { User } from '../../common/decorators/user.decorator';

@Injectable()
export class ClassSessionLogicService {
  constructor(
    private classSessionDataService: ClassSessionDataService,
    private batchDataService: BatchDataService,
    private teacherDataService: TeacherDataService,
  ) {}

  private async mapToDto(session: ClassSessionDocument): Promise<ClassSession> {
    // Populate only batchId and teacherId
    await session.populate('batchId');
    await session.populate('teacherId');

    const batchName = session.batchId ? (session.batchId as any).name : '';
    const teacherName = session.teacherId ? (session.teacherId as any).name : '';
    const dto = mapToDto<ClassSession, ClassSessionDocument>(session);
    return { ...dto, batchName, teacherName };
  }

  private async mapToDtoArray(sessions: ClassSessionDocument[]): Promise<ClassSession[]> {
    // Populate each session individually
    const populatedSessions = await Promise.all(
      sessions.map(async session => {
        await session.populate('batchId');
        await session.populate('teacherId');
        return session;
      }),
    );

    return populatedSessions.map(session => {
      const batchName = session.batchId ? (session.batchId as any).name : '';
      const teacherName = session.teacherId ? (session.teacherId as any).name : '';
      const dto = mapToDto<ClassSession, ClassSessionDocument>(session);
      return { ...dto, batchName, teacherName };
    });
  }

  async getClassSessions(user: any): Promise<GetClassSessionsResponseDTO> {
    let sessions: ClassSessionDocument[];
    if (user.role === 'teacher') {
      sessions = await this.classSessionDataService.getClassSessionsByTeacher(user.teacherId);
    } else {
      sessions = await this.classSessionDataService.getClassSessions();
    }
    return {
      classSessions: await this.mapToDtoArray(sessions),
    };
  }

  async createClassSession(createClassSessionDto: CreateClassSessionDto) {
    // Validate foreign keys
    const batch = await this.batchDataService.getBatchById(createClassSessionDto.batchId);
    if (!batch) {
      throw new BadRequestException(`Batch with ID ${createClassSessionDto.batchId} not found`);
    }

    const teacher = await this.teacherDataService.getTeacherById(createClassSessionDto.teacherId);
    if (!teacher) {
      throw new BadRequestException(`Teacher with ID ${createClassSessionDto.teacherId} not found`);
    }

    // Validate date and time
    const scheduledDate = new Date(createClassSessionDto.scheduledDate);
    if (scheduledDate < new Date()) {
      throw new BadRequestException('Scheduled date must be in the future');
    }

    const startTime = this.parseTime(createClassSessionDto.scheduledStartTime);
    const endTime = this.parseTime(createClassSessionDto.scheduledEndTime);
    if (endTime <= startTime) {
      throw new BadRequestException('End time must be after start time');
    }

    // Check for teacher conflict
    const conflict = await this.classSessionDataService.checkTeacherConflict(
      createClassSessionDto.teacherId,
      scheduledDate,
      createClassSessionDto.scheduledStartTime,
      createClassSessionDto.scheduledEndTime,
    );
    if (conflict) {
      throw new BadRequestException('Teacher is already scheduled for this time');
    }

    const session = await this.classSessionDataService.createClassSession(createClassSessionDto);
    return {
      classSession: await this.mapToDto(session),
    };
  }

  async getClassSessionById(id: string, user: any) {
    const session = await this.classSessionDataService.getClassSessionById(id);
    if (!session) {
      throw new NotFoundException(`Class session with ID ${id} not found`);
    }

    if (user.role === 'teacher' && session.teacherId.toString() !== user.teacherId) {
      throw new BadRequestException('You can only access your own class sessions');
    }

    return {
      classSession: await this.mapToDto(session),
    };
  }

  async updateClassSession(id: string, updateClassSessionDto: UpdateClassSessionDto, user: any) {
    const session = await this.classSessionDataService.getClassSessionById(id);
    if (!session) {
      throw new NotFoundException(`Class session with ID ${id} not found`);
    }

    if (user.role === 'teacher') {
      if (session.teacherId.toString() !== user.teacherId) {
        throw new BadRequestException('You can only update your own class sessions');
      }
      // Teachers can only update recordingUrl
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

    // Admin validations
    if (updateClassSessionDto.batchId) {
      const batch = await this.batchDataService.getBatchById(updateClassSessionDto.batchId);
      if (!batch) {
        throw new BadRequestException(`Batch with ID ${updateClassSessionDto.batchId} not found`);
      }
    }

    if (updateClassSessionDto.teacherId) {
      const teacher = await this.teacherDataService.getTeacherById(updateClassSessionDto.teacherId);
      if (!teacher) {
        throw new BadRequestException(`Teacher with ID ${updateClassSessionDto.teacherId} not found`);
      }
    }

    if (updateClassSessionDto.scheduledDate || updateClassSessionDto.scheduledStartTime || updateClassSessionDto.scheduledEndTime) {
      const scheduledDate = updateClassSessionDto.scheduledDate
        ? new Date(updateClassSessionDto.scheduledDate)
        : session.scheduledDate;
      const startTime = updateClassSessionDto.scheduledStartTime || session.scheduledStartTime;
      const endTime = updateClassSessionDto.scheduledEndTime || session.scheduledEndTime;

      if (scheduledDate < new Date()) {
        throw new BadRequestException('Scheduled date must be in the future');
      }

      const parsedStartTime = this.parseTime(startTime);
      const parsedEndTime = this.parseTime(endTime);
      if (parsedEndTime <= parsedStartTime) {
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

    const updatedSession = await this.classSessionDataService.updateClassSession(id, updateClassSessionDto);
    if (!updatedSession) {
      throw new NotFoundException(`Class session with ID ${id} not found`);
    }
    return {
      classSession: await this.mapToDto(updatedSession),
    };
  }

  async deleteClassSession(id: string) {
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
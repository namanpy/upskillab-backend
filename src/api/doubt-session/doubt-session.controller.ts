import { Types } from 'mongoose';
import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Get, // Import Get
} from '@nestjs/common';
import { DoubtSessionLogicService } from './doubt-session.logic';
import {
  CreateDoubtDto,
  CreateDoubtResponseDto,
  AddMessageDto,
  AddMessageResponseDto,
  GetDoubtsResponseDto, // Import the new DTO
} from 'src/dto/doubt-session.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  AllowUserType,
  AllowUserTypes,
  UserGuard,
} from 'src/common/guard/user.guard';
import { USER_TYPES } from 'src/common/constants/user.constants';
import { StudentDataService } from '../student/student.data';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { TeacherDataService } from '../teachers/teacher.data';
import { ApiResponse } from '@nestjs/swagger';

@Controller('/doubts')
export class DoubtSessionController {
  constructor(
    private logic: DoubtSessionLogicService,
    private studentDataService: StudentDataService,
    private teacherDataService: TeacherDataService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @AllowUserType(USER_TYPES.STUDENT)
  async createDoubt(
    @Body() body: CreateDoubtDto,
    @Request() req: any,
  ): Promise<CreateDoubtResponseDto> {
    if (req.user) {
      const student = await this.studentDataService.getStudentByUserId(
        req.user._id,
      );
      if (student?._id) {
        return this.logic.createDoubt({
          ...body,
          studentId: student._id,
          userId: req.user._id,
        });
      } else throw new CustomError(ERROR.UNAUTHORIZED);
    } else throw new CustomError(ERROR.UNAUTHORIZED);
  }

  @Post(':doubtId/message')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @AllowUserTypes([USER_TYPES.STUDENT, USER_TYPES.TEACHER])
  async addMessage(
    @Param('doubtId') doubtId: string,
    @Body() body: AddMessageDto,
    @Request() req: any,
  ): Promise<AddMessageResponseDto> {
    if (req.user) {
      const studentId =
        req.user.userType === USER_TYPES.STUDENT
          ? await this.studentDataService
              .getStudentByUserId(req.user._id)
              .then((student) => student?._id)
          : undefined;

      const teacherId =
        req.user.userType === USER_TYPES.TEACHER
          ? await this.teacherDataService
              .getTeacherByUserId(req.user._id)
              .then((teacher) => teacher?._id)
          : undefined;

      if (studentId || teacherId) {
        return this.logic.addMessage(doubtId, {
          ...body,
          userId: req.user._id,
          teacherId: teacherId,
          studentId: studentId,
        });
      } else throw new CustomError(ERROR.UNAUTHORIZED);
    } else throw new CustomError(ERROR.UNAUTHORIZED);
  }

  @Get()
  @ApiResponse({
    type: GetDoubtsResponseDto,
    description: 'Get all doubts for the authenticated user',
  })
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @AllowUserTypes([USER_TYPES.STUDENT, USER_TYPES.TEACHER])
  async getDoubts(@Request() req: any): Promise<GetDoubtsResponseDto> {
    if (!req.user) {
      throw new CustomError(ERROR.UNAUTHORIZED);
    }

    let studentId: Types.ObjectId | undefined;
    let teacherId: Types.ObjectId | undefined;

    if (req.user.userType === USER_TYPES.STUDENT) {
      const student = await this.studentDataService.getStudentByUserId(
        req.user._id,
      );
      if (!student?._id) throw new CustomError(ERROR.UNAUTHORIZED);
      studentId = student._id;
    } else if (req.user.userType === USER_TYPES.TEACHER) {
      // Assuming teacher's main ID is directly on req.user._id or you have a similar service
      const teacher = await this.teacherDataService.getTeacherByUserId(
        req.user._id,
      ); // Adjust if needed
      if (!teacher?._id) throw new CustomError(ERROR.UNAUTHORIZED);
      teacherId = teacher._id;
    } else {
      throw new CustomError(ERROR.UNAUTHORIZED);
    }

    return this.logic.getDoubts({ studentId, teacherId });
  }
}

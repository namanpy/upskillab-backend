import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DoubtSessionLogicService } from './doubt-session.logic';
import {
  CreateDoubtDto,
  CreateDoubtResponseDto,
  AddMessageDto,
  AddMessageResponseDto,
} from 'src/dto/doubt-session.dto';
import { AuthGuard } from '@nestjs/passport';
import { AllowUserType, UserGuard } from 'src/common/guard/user.guard';
import { USER_TYPES } from 'src/common/constants/user.constants';
import { StudentDataService } from '../student/student.data';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { TeacherDataService } from '../teachers/teacher.data';

@Controller('/doubts')
export class DoubtSessionController {
  constructor(
    private logic: DoubtSessionLogicService,
    private studentDataService: StudentDataService,
    private teacherDataService: TeacherDataService,
  ) {}

  @UseGuards(AuthGuard('jwt'), UserGuard)
  @AllowUserType(USER_TYPES.STUDENT)
  @Post()
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
              .getTeacherById(req.user._id)
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
}

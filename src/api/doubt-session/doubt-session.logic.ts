import { Injectable } from '@nestjs/common';
import { DoubtSessionDataService } from './doubt-session.data';
import { Types } from 'mongoose';
import { CreateDoubtDto, AddMessageDto } from 'src/dto/doubt-session.dto';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { EnrollmentDataService } from '../enrollment/enrollment.data';

@Injectable()
export class DoubtSessionLogicService {
  constructor(
    private dataService: DoubtSessionDataService,
    private enrollmentDataService: EnrollmentDataService,
  ) {}

  async createDoubt(
    input: CreateDoubtDto & {
      studentId: Types.ObjectId;
      userId: Types.ObjectId;
    },
  ) {
    const enrollment =
      await this.enrollmentDataService.getEnrollmentsByCourseAndUser(
        input.userId,
        input.courseId,
      );

    if (!enrollment) {
      throw new CustomError(ERROR.UNAUTHORIZED);
    }

    const doubt = await this.dataService.createDoubt({
      studentId: new Types.ObjectId(input.studentId),
      courseId: new Types.ObjectId(input.courseId),
      question: input.question,
      attachments: input.attachments,
    });

    return {
      status: 'success',
      message: 'Doubt submitted successfully',
      doubtId: doubt._id.toString(),
    };
  }

  async addMessage(
    doubtId: string,
    input: AddMessageDto & {
      userId: Types.ObjectId;
      studentId?: Types.ObjectId;
      teacherId?: Types.ObjectId;
    },
  ) {
    // Fetch the doubt to check ownership
    const doubt = await this.dataService.getDoubtById(doubtId);

    if (!doubt) {
      throw new CustomError(ERROR.NOT_FOUND);
    }

    // If the sender is a student, check if they are the owner of the doubt
    if (input.studentId && !doubt.student.equals(input.studentId)) {
      throw new CustomError(ERROR.UNAUTHORIZED);
    }

    await this.dataService.addMessageToDoubt(doubtId, {
      user: input.userId,
      message: input.message,
      attachments: input.attachments,
    });

    return {
      status: 'success',
      message: 'Message submitted successfully',
    };
  }
}

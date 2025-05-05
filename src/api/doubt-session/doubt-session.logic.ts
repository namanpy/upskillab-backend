import { Injectable } from '@nestjs/common';
import { DoubtSessionDataService } from './doubt-session.data';
import { Types } from 'mongoose';
import { CreateDoubtDto, AddMessageDto } from 'src/dto/doubt-session.dto';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
import { EnrollmentDataService } from '../enrollment/enrollment.data';
import { GetDoubtsResponseDto } from 'src/dto/doubt-session.dto'; // Import the new DTO
import { TeacherDataService } from '../teachers/teacher.data';
import { StudentDataService } from '../student/student.data';

@Injectable()
export class DoubtSessionLogicService {
  constructor(
    private dataService: DoubtSessionDataService,
    private enrollmentDataService: EnrollmentDataService,
    private teacherDataService: TeacherDataService, // Inject the teacher data service
    private studentDataService: StudentDataService, // Inject the student data service
  ) {}

  async createDoubt(
    input: CreateDoubtDto & {
      studentId: Types.ObjectId;
      userId: Types.ObjectId;
    },
  ) {
    const enrollment =
      await this.enrollmentDataService.getEnrollmentByCourseAndUser(
        input.userId,
        input.courseId,
      );

    if (!enrollment) {
      throw new CustomError(ERROR.UNAUTHORIZED);
    }

    const doubt = await this.dataService.createDoubt({
      studentId: new Types.ObjectId(input.studentId),
      courseId: new Types.ObjectId(input.courseId),
      teacherId: enrollment.batch.teacher,
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

  async getDoubts(input: {
    studentId?: Types.ObjectId;
    teacherId?: Types.ObjectId;
  }): Promise<GetDoubtsResponseDto> {
    const doubts = await this.dataService.getDoubts(input);
    return {
      doubts: await Promise.all(
        doubts.map(async (doubt) => {
          const messages = await Promise.all(
            doubt.messages.map(async (message) => {
              return {
                user: message.user,
                teacher:
                  (await this.teacherDataService.getTeacherByUserIdUnpopulated(
                    message.user._id,
                  )) ?? undefined,
                student:
                  (await this.studentDataService.getStudentByUserId(
                    message.user._id,
                  )) ?? undefined,
                message: message.message,
                attachments: message.attachments,
                timestamp: message.createdAt,
              };
            }),
          );
          return {
            _id: doubt._id.toString(),
            student: doubt.student,
            course: doubt.course,
            teacher: doubt.teacher,
            question: doubt.question,
            attachments: doubt.attachments,
            messages,
          };
        }),
      ),
    }; // Wrap the result in the DTO structure
  }
}

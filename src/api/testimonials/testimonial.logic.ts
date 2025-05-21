import { Injectable, NotFoundException } from '@nestjs/common';
import { TestimonialDataService } from './testimonial.data';
import { Types } from 'mongoose';
// import { CreateTestimonialDto } from '../../dto/testimonial.dto';
import {
  CreateTestimonialDto,
  GetTestimonialsResponseDTO,
} from '../../dto//home/testimonial.dto';
import { StudentDataService } from '../student/student.data';
import { USER_TYPES } from 'src/common/constants/user.constants';
import { CustomError } from 'src/common/classes/error.class';
import { ERROR } from 'src/common/constants/error.constants';
// import { TestimonialDocument } from '../../schemas/testimonial.schema';

@Injectable()
export class TestimonialLogicService {
  constructor(
    private testimonialDataService: TestimonialDataService,
    private studentDataService: StudentDataService,
  ) {}

  async getTestimonials({
    userType,
    userId,
  }: {
    userType?: string;
    userId?: Types.ObjectId;
  }): Promise<GetTestimonialsResponseDTO> {
    let studentId: Types.ObjectId | undefined;

    if (userType === USER_TYPES.STUDENT && userId) {
      const student = await this.studentDataService.getStudentByUserId(userId);
      studentId = student?._id;
    }
    const testimonials = await this.testimonialDataService.getTestimonials({
      onlyActive: userType !== USER_TYPES.ADMIN && !studentId,
      studentId,
    });

    return {
      testimonials: testimonials.map((testimonial) => ({
        _id: testimonial._id.toString(),
        name: testimonial.name,
        testimonialImageUrl: testimonial.testimonialImageUrl,
        email: testimonial.email,
        description: testimonial.description,
        socialMediaLinks: testimonial.socialMediaLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
        })),
        isActive:testimonial.isActive,
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt,
      })),
    };
  }

  async createTestimonial(
    createTestimonialDto: CreateTestimonialDto & { userId?: Types.ObjectId },
  ) {
    const student = createTestimonialDto.userId
      ? await this.studentDataService.getStudentByUserId(
          createTestimonialDto.userId,
        )
      : undefined;
    console.log(student)
    const testimonial = await this.testimonialDataService.createTestimonial({
      ...createTestimonialDto,
      name: student?.fullName || createTestimonialDto.name,
      testimonialImageUrl:
        student?.image || createTestimonialDto.testimonialImageUrl,
      socialMediaLinks: createTestimonialDto.socialMediaLinks || [],
      student: student?._id,
      isActive: !student?._id,
    });

    return {
      testimonial: {
        _id: testimonial._id.toString(),
        name: testimonial.name,
        testimonialImageUrl: testimonial.testimonialImageUrl,
        email: testimonial.email,
        description: testimonial.description,
        socialMediaLinks: testimonial.socialMediaLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
        })),
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt,
      },
    };
  }

  async getTestimonialById(id: string) {
    const testimonial =
      await this.testimonialDataService.getTestimonialById(id);
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return {
      testimonial: {
        _id: testimonial._id.toString(),
        name: testimonial.name,
        testimonialImageUrl: testimonial.testimonialImageUrl,
        email: testimonial.email,
        description: testimonial.description,
        socialMediaLinks: testimonial.socialMediaLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
        })),
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt,
      },
    };
  }

  async updateTestimonial(
    id: string,
    updateTestimonialDto: Partial<CreateTestimonialDto> & {
      userId: Types.ObjectId;
      userType: string;
    },
  ) {
    const existingTestimonial =
      await this.testimonialDataService.getTestimonialById(id);

    if (!existingTestimonial) throw new CustomError(ERROR.NOT_FOUND);

    if (updateTestimonialDto.userType === USER_TYPES.STUDENT) {
      const student = await this.studentDataService.getStudentByUserId(
        updateTestimonialDto.userId,
      );

      // If not the owner of the testimonial, throw an error
      if (
        !existingTestimonial.student ||
        !student?._id?.equals(existingTestimonial.student)
      )
        throw new CustomError(ERROR.UNAUTHORIZED);
    }

    const testimonial = await this.testimonialDataService.updateTestimonial(
      id,
      {
        ...updateTestimonialDto,
        ...(updateTestimonialDto.userType === USER_TYPES.STUDENT && {
          isActive: false,
        }),
      },
    );

    if (!testimonial) throw new CustomError(ERROR.NOT_FOUND);

    return {
      testimonial: {
        _id: testimonial._id.toString(),
        name: testimonial.name,
        testimonialImageUrl: testimonial.testimonialImageUrl,
        email: testimonial.email,
        description: testimonial.description,
        socialMediaLinks: testimonial.socialMediaLinks.map((link) => ({
          platform: link.platform,
          url: link.url,
        })),
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt,
      },
    };
  }

  async deleteTestimonial(id: string) {
    const testimonial = await this.testimonialDataService.deleteTestimonial(id);
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }
    return { message: 'Testimonial deleted successfully' };
  }
}

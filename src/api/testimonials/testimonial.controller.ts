import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TestimonialLogicService } from './testimonial.logic';
import {
  CreateTestimonialDto,
  GetTestimonialsResponseDTO,
} from '../../dto/home/testimonial.dto';
// import {  } from '../../dto/testimonial.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AllowUserTypes, UserGuard } from 'src/common/guard/user.guard';
import { USER_TYPES } from 'src/common/constants/user.constants';
import { CustomError } from 'src/common/classes/error.class';
import { StudentDataService } from '../student/student.data';
import { TeacherDataService } from '../teachers/teacher.data';
import { ERROR } from 'src/common/constants/error.constants';
import { OptionalAuthGuard } from 'src/common/guard/optional-auth.guard';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialController {
  constructor(private testimonialLogicService: TestimonialLogicService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all testimonials',
    type: GetTestimonialsResponseDTO,
  })
  @Get('')
  @UseGuards(OptionalAuthGuard)
  async getTestimonials(@Request() req): Promise<GetTestimonialsResponseDTO> {
    return await this.testimonialLogicService.getTestimonials({
      userType: req.user?.userType,
    });
  }

  @ApiResponse({
    status: 201,
    description: 'Create a new testimonial',
  })
  @Post('')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @AllowUserTypes([USER_TYPES.STUDENT, USER_TYPES.ADMIN])
  async createTestimonial(
    @Body() createTestimonialDto: CreateTestimonialDto,
    @Request() req: any,
  ) {
    if (req.user) {
      return await this.testimonialLogicService.createTestimonial({
        ...createTestimonialDto,
        userId: req.user._id,
      });
    } else throw new CustomError(ERROR.UNAUTHORIZED);
  }

  @ApiResponse({
    status: 200,
    description: 'Get a single testimonial by ID',
  })
  @Get(':id')
  async getTestimonialById(@Param('id') id: string) {
    return await this.testimonialLogicService.getTestimonialById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update a testimonial by ID',
  })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  @AllowUserTypes([USER_TYPES.STUDENT, USER_TYPES.ADMIN])
  async updateTestimonial(
    @Param('id') id: string,
    @Body() updateTestimonialDto: Partial<CreateTestimonialDto>,
    @Request() req: any,
  ) {
    if (req.user) {
      return await this.testimonialLogicService.updateTestimonial(id, {
        ...updateTestimonialDto,
        userId: req.user._id,
        userType: req.user.userType,
      });
    } else throw new CustomError(ERROR.UNAUTHORIZED);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a testimonial by ID',
  })
  @Delete(':id')
  async deleteTestimonial(@Param('id') id: string) {
    return await this.testimonialLogicService.deleteTestimonial(id);
  }
}

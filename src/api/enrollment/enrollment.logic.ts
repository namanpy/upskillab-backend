import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EnrollmentDataService } from './enrollment.data';
import { EnrollmentResponseDTO, EnrollmentErrorDTO } from '../../dto/enrollment.dto';
import { USER_TYPES } from '../../common/constants/user.constants';

// Export IUser so it can be imported in controller
export interface IUser {
  _id: any;
  userId: string;
  role: string;
  userType: string;
}

@Injectable()
export class EnrollmentLogicService {
  constructor(private enrollmentDataService: EnrollmentDataService) {}

  async getEnrollment(user: IUser): Promise<EnrollmentResponseDTO | EnrollmentErrorDTO> {
    // Step 1: Check if userType is STUDENT
    if (user.userType !== USER_TYPES.STUDENT) {
      throw new UnauthorizedException('Only students can access enrollment details');
    }

    // Step 2: Fetch user, student, and order details
    const { user: userData, student, order } = await this.enrollmentDataService.getEnrollmentByUserId(user._id);

    // Step 3: Check if order status is COMPLETED
    // if (order.status !== ORDER_STATUS.COMPLETED) {
    //   return { message: 'Please pay the fee first' };
    // }

    // Step 4: Check if user.isActive is true
    if (!userData.isActive) {
      return { message: 'Pending profile, admin will contact you soon' };
    }

    // Step 5: Map to DTOs using mapToDto utility
    // const GetUserResponseDTO: GetUserResponseDTO = mapToDto<GetUserResponseDTO, any>(userData);
    // const studentDTO: StudentDTO = mapToDto<StudentDTO, any>(student);
    // const GetOrdersResponseDto: GetOrdersResponseDto = mapToDto<GetOrdersResponseDto, any>(order);
    // const GetBatchesResponseDTO: GetBatchesResponseDTO = mapToDto<GetBatchesResponseDTO, any>(order.batch);

    return {
      user: userData,
      student: student,
      order: order,
      batch: order.map(d => d.batch),
    };
  }
}
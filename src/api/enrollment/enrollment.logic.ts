import { Batch } from 'src/schemas/course/batch.schema';
// import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { EnrollmentDataService } from './enrollment.data';
// import { CreateEnrollmentDto, UpdateEnrollmentDto, GetEnrollmentsResponseDTO, Enrollment } from '../../dto/enrollment.dto';
// import { EnrollmentDocument } from '../../schemas/enrollment.schema';
// import { mapToDto, mapToDtoArray } from '../../common/utils/map-to-dto.util';
// import { OrderLogicService } from '../order/order.logic';

// // Define a proper interface for the User
// interface IUser {
//   _id: any;
//   userId: string;
//   userType: string;
// }

// @Injectable()
// export class EnrollmentLogicService {
//   constructor(
//     private enrollmentDataService: EnrollmentDataService,
//     private orderLogicService: OrderLogicService,
//   ) {}

//   private async mapToDto(enrollment: EnrollmentDocument): Promise<Enrollment> {
//     // First get the enrollment document
//     const populatedEnrollment = await enrollment;
    
//     // Then populate it properly with all needed fields
//     await populatedEnrollment.populate('userId');
//     await populatedEnrollment.populate('courseId');
//     await populatedEnrollment.populate('batchId');
//     await populatedEnrollment.populate('orderId');
    
//     // Finally convert it to DTO
//     return mapToDto<Enrollment, any>(populatedEnrollment);
//   }

//   private async mapToDtoArray(enrollments: EnrollmentDocument[]): Promise<Enrollment[]> {
//     const populatedEnrollments = await Promise.all(
//       enrollments.map(async (enrollment) => {
//         const doc = await enrollment;
//         await doc.populate('userId');
//         await doc.populate('courseId');
//         await doc.populate('batchId');
//         await doc.populate('orderId');
//         return doc;
//       }),
//     );
    
//     return populatedEnrollments.map(enrollment => 
//       mapToDto<Enrollment, any>(enrollment)
//     );
//   }

//   async getEnrollments(user: IUser): Promise<GetEnrollmentsResponseDTO> {
//     let enrollments: EnrollmentDocument[];
    
//     if (user.userType === 'ADMIN') {
//       enrollments = await this.enrollmentDataService.getEnrollments();
//       enrollments = enrollments.filter(enrollment => enrollment.status === 'COMPLETED');
//     } else if (user.userType === 'STUDENT') {
//       enrollments = await this.enrollmentDataService.getEnrollmentsByUser(user.userId);
//       if (enrollments.some(enrollment => enrollment.isActive === false)) {
//         throw new UnauthorizedException('Your profile is pending');
//       }
//     } else {
//       throw new UnauthorizedException('Access denied');
//     }
    
//     return { enrollments: await this.mapToDtoArray(enrollments) };
//   }

//   async createEnrollment(createEnrollmentDto: CreateEnrollmentDto, user: IUser) {
//     if (user.userType !== 'ADMIN') {
//       throw new UnauthorizedException('Only ADMINs can create enrollments');
//     }
    
//     const order = await this.orderLogicService.getOrderById(createEnrollmentDto.orderId);
//     if (!order || order.status !== 'COMPLETED') {
//       throw new UnauthorizedException('Order not completed');
//     }
    
//     const enrollment = await this.enrollmentDataService.createEnrollment(createEnrollmentDto);
//     return { enrollment: await this.mapToDto(enrollment) };
//   }

//   async getEnrollmentById(id: string, user: IUser) {
//     const enrollment = await this.enrollmentDataService.getEnrollmentById(id);
//     if (!enrollment) {
//       throw new NotFoundException(`Enrollment with ID ${id} not found`);
//     }

//     if (user.userType === 'STUDENT') {
//       if (enrollment.userId.toString() !== user.userId) {
//         throw new UnauthorizedException('Access denied');
//       }
//       if (enrollment.isActive === false) {
//         throw new UnauthorizedException('Your profile is pending');
//       }
//     } else if (user.userType === 'ADMIN') {
//       if (enrollment.status !== 'COMPLETED') {
//         throw new UnauthorizedException('Only completed enrollments visible to ADMIN');
//       }
//     } else {
//       throw new UnauthorizedException('Access denied');
//     }

//     return { enrollment: await this.mapToDto(enrollment) };
//   }

//   async updateEnrollment(id: string, updateEnrollmentDto: UpdateEnrollmentDto, user: IUser) {
//     if (user.userType !== 'ADMIN') {
//       throw new UnauthorizedException('Only ADMINs can update enrollments');
//     }
    
//     const enrollment = await this.enrollmentDataService.getEnrollmentById(id);
//     if (!enrollment) {
//       throw new NotFoundException(`Enrollment with ID ${id} not found`);
//     }
    
//     if (updateEnrollmentDto.isActive && enrollment.status !== 'COMPLETED') {
//       throw new UnauthorizedException('Cannot activate profile for pending order');
//     }
    
//     const updatedEnrollment = await this.enrollmentDataService.updateEnrollment(id, updateEnrollmentDto);
//     if (!updatedEnrollment) {
//       throw new NotFoundException(`Failed to update enrollment with ID ${id}`);
//     }
    
//     return { enrollment: await this.mapToDto(updatedEnrollment) };
//   }

//   async deleteEnrollment(id: string, user: IUser) {
//     if (user.userType !== 'ADMIN') {
//       throw new UnauthorizedException('Only ADMINs can delete enrollments');
//     }
    
//     const enrollment = await this.enrollmentDataService.deleteEnrollment(id);
//     if (!enrollment) {
//       throw new NotFoundException(`Enrollment with ID ${id} not found`);
//     }
    
//     return { message: 'Enrollment deleted successfully' };
//   }
// }



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
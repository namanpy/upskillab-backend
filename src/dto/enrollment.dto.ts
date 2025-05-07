// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { IsMongoId, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';

// export enum EnrollmentStatus {
//   PENDING = 'PENDING',
//   COMPLETED = 'COMPLETED',
// }

// export class CreateEnrollmentDto {
//   @ApiProperty()
//   @IsMongoId()
//   @IsNotEmpty()
//   userId: string;

//   @ApiProperty()
//   @IsMongoId()
//   @IsNotEmpty()
//   courseId: string;

//   @ApiProperty()
//   @IsMongoId()
//   @IsNotEmpty()
//   batchId: string;

//   @ApiProperty()
//   @IsMongoId()
//   @IsNotEmpty()
//   orderId: string;

//   @ApiProperty({ enum: EnrollmentStatus })
//   @IsEnum(EnrollmentStatus)
//   status: EnrollmentStatus;

//   @ApiProperty()
//   @IsBoolean()
//   @IsOptional()
//   isActive?: boolean;
// }

// export class UpdateEnrollmentDto {
//   @ApiPropertyOptional()
//   @IsEnum(EnrollmentStatus)
//   @IsOptional()
//   status?: EnrollmentStatus;

//   @ApiPropertyOptional()
//   @IsBoolean()
//   @IsOptional()
//   isActive?: boolean;
// }

// export class Enrollment {
//   @ApiProperty()
//   _id: string;

//   @ApiProperty()
//   userId: string;

//   @ApiProperty()
//   courseId: string;

//   @ApiProperty()
//   batchId: string;

//   @ApiProperty()
//   orderId: string;

//   @ApiProperty()
//   status: EnrollmentStatus;

//   @ApiProperty()
//   isActive: boolean;

//   @ApiProperty()
//   createdAt: Date;

//   @ApiProperty()
//   updatedAt: Date;
// }

// export class GetEnrollmentsResponseDTO {
//   @ApiProperty({ type: [Enrollment] })
//   enrollments: Enrollment[];
// }

import { ApiProperty } from '@nestjs/swagger';
import { GetUserResponseDTO } from './user.dto';
import { StudentDTO } from './student.dto';
import { GetOrdersResponseDto } from './order.dto';
import { GetBatchesResponseDTO } from './course/batch.dto';
import { User } from 'src/schemas/user.schema';
import { Student } from 'src/schemas/student.schema';
import { Batch } from 'src/schemas/course/batch.schema';
import { Order } from 'src/schemas/order.schema';
// import { User } from 'src/schemas/user.schema';

export class EnrollmentResponseDTO {
  @ApiProperty()
  user: User;

  @ApiProperty()
  student: Student;

  @ApiProperty()
  order: (Omit<Order, 'batch'> & { batch: Batch })[];

  @ApiProperty()
  batch: Batch[];
}

export class EnrollmentErrorDTO {
  @ApiProperty({ description: 'Error message' })
  message: string;
}

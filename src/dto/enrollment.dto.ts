import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export enum EnrollmentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export class CreateEnrollmentDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  batchId: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ enum: EnrollmentStatus })
  @IsEnum(EnrollmentStatus)
  status: EnrollmentStatus;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateEnrollmentDto {
  @ApiPropertyOptional()
  @IsEnum(EnrollmentStatus)
  @IsOptional()
  status?: EnrollmentStatus;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class Enrollment {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  courseId: string;

  @ApiProperty()
  batchId: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  status: EnrollmentStatus;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetEnrollmentsResponseDTO {
  @ApiProperty({ type: [Enrollment] })
  enrollments: Enrollment[];
}
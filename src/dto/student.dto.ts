import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentDTO {
  @ApiProperty({ description: 'Student ID' })
  _id: string;

  @ApiProperty({ description: 'Full name of the student' })
  fullName: string;

  @ApiPropertyOptional({ description: 'College name of the student' })
  college?: string;

  @ApiProperty({ description: 'Type of student' })
  studentType: string;

  @ApiPropertyOptional({ description: 'Profile image URL of the student' })
  image?: string;

  @ApiPropertyOptional({ description: 'Bio of the student' })
  bio?: string;

  @ApiPropertyOptional({ description: 'Skills of the student', type: [String] })
  skills?: string[];

  @ApiPropertyOptional({ description: 'Email of the student (from User)' })
  email?: string;

  @ApiPropertyOptional({ description: 'Mobile number of the student (from Order)' })
  mobileNumber?: string;
}

export class UpdateStudentDTO {
  @ApiPropertyOptional({ description: 'Full name of the student' })
  fullName?: string;

  @ApiPropertyOptional({ description: 'College name of the student' })
  college?: string;

  @ApiPropertyOptional({ description: 'Type of student' })
  studentType?: string;

  @ApiPropertyOptional({ description: 'Profile image URL of the student' })
  image?: string;


  @ApiPropertyOptional({ description: 'Bio of the student' })
  bio?: string;

  @ApiPropertyOptional({ description: 'Skills of the student', type: [String] })
  skills?: string[];

  @ApiPropertyOptional({ description: 'Email of the student (from User)' })
  email?: string;

  @ApiPropertyOptional({ description: 'Mobile number of the student (from Order)' })
  mobileNumber?: string;
}
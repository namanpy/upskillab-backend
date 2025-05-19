import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsMongoId, ValidateIf } from 'class-validator';

export class QualificationDto {
  @ApiProperty()
  @IsString({ groups: ['createApplication'] })
  @IsNotEmpty({ groups: ['createApplication'] })
  collegeName: string;

  @ApiProperty()
  @IsNumber({}, { groups: ['createApplication'] })
  @IsNotEmpty({ groups: ['createApplication'] })
  passingYear: number;

  @ApiProperty()
  @IsString({ groups: ['createApplication'] })
  @IsNotEmpty({ groups: ['createApplication'] })
  branch: string;
}

export class CreateApplicationDto {
  @ApiProperty()
  @IsString({ groups: ['createApplication'] })
  @IsNotEmpty({ groups: ['createApplication'] })
  fullName: string;

  @ApiProperty()
  @IsString({ groups: ['createApplication'] })
  @IsNotEmpty({ groups: ['createApplication'] })
  email: string;

  @ApiProperty()
  @IsString({ groups: ['createApplication'] })
  @IsNotEmpty({ groups: ['createApplication'] })
  phoneNumber: string;

  @ApiProperty()
  @IsMongoId({ groups: ['createApplication'] })
  @IsNotEmpty({ groups: ['createApplication'] })
  jobId: string;

  @ApiProperty()
  @IsNotEmpty({ groups: ['createApplication'] })
  qualification: QualificationDto;

  @ApiProperty({ type: 'string', format: 'binary' })
  @ValidateIf((object, value) => false, { groups: ['createApplication'] })
  resume: Express.Multer.File;

  @ApiProperty()
  @IsString({ groups: ['createApplication'] })
  @IsNotEmpty({ groups: ['createApplication'] })
  source: string;
}

export class ApplicationResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  jobId: string;

  @ApiProperty()
  qualification: QualificationDto;

  @ApiProperty()
  resumeUrl: string;

  @ApiProperty()
  source: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetApplicationsResponseDTO {
  @ApiProperty({ type: [ApplicationResponse] })
  applications: ApplicationResponse[];
}
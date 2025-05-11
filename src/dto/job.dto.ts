import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateIf } from 'class-validator';

// For controller (file upload)
export class CreateJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  logo?: Express.Multer.File;

  @ApiProperty({ type: [String] })
  @ValidateIf(o => typeof o.skills === 'string') // Validate as string if it's a string
  @IsString()
  @IsNotEmpty()
  @ValidateIf(o => Array.isArray(o.skills)) // Validate as array if it's an array
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  skills: string | string[]; // Allow both string and array
}

// For controller (file upload)
export class UpdateJobDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  company?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  logo?: Express.Multer.File;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @ValidateIf(o => typeof o.skills === 'string')
  @IsString()
  @IsNotEmpty()
  @ValidateIf(o => Array.isArray(o.skills))
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  skills?: string | string[]; // Allow both string and array
}

// For job.data.ts (database operations)
export interface CreateJobData {
  title: string;
  subtitle: string;
  description: string;
  company: string;
  logo: string;
  skills: string[];
}

// For job.data.ts (database operations)
export interface UpdateJobData {
  title?: string;
  subtitle?: string;
  description?: string;
  company?: string;
  logo?: string;
  skills?: string[];
}

export class JobResponse {
  @ApiProperty({ type: String })
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  subtitle: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  logo: string;

  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetJobsResponseDTO {
  @ApiProperty({ type: [JobResponse] })
  jobs: JobResponse[];
}
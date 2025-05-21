import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString,IsBoolean, IsNotEmpty, IsOptional, IsArray, ValidateIf, IsEnum } from 'class-validator';

// For controller (file upload)
export class CreateJobDto {
  @ApiProperty({ description: 'Title of the job' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Subtitle or short description of the job' })
  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @ApiProperty({ description: 'Detailed description of the job' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Name of the company offering the job' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Company logo file' })
  @IsOptional()
  logo?: Express.Multer.File;

  @ApiProperty({ type: [String], description: 'List of required skills for the job' })
  @ValidateIf(o => typeof o.skills === 'string')
  @IsString()
  @IsNotEmpty()
  @ValidateIf(o => Array.isArray(o.skills))
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  skills: string | string[];

  @ApiPropertyOptional({ type: "string", description: 'Additional links related to the job' })
  @IsOptional()
  @IsString()
  @IsString({ each: true })
  ExtraLink?: string;

  @ApiPropertyOptional({
    description: 'Source of the job (upskill or external)',
    enum: ['upskill', 'external'],
  })
  @IsOptional()
  @IsEnum(['upskill', 'external'])
  source?: string;

  @ApiProperty()
  @IsBoolean()
  isPublic: boolean;
}

// For controller (file upload)
export class UpdateJobDto {
  @ApiPropertyOptional({ description: 'Title of the job' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ description: 'Subtitle or short description of the job' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Detailed description of the job' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({ description: 'Name of the company offering the job' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  company?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Company logo file' })
  @IsOptional()
  logo?: Express.Multer.File;

  @ApiPropertyOptional({ type: [String], description: 'List of required skills for the job' })
  @IsOptional()
  @ValidateIf(o => typeof o.skills === 'string')
  @IsString()
  @IsNotEmpty()
  @ValidateIf(o => Array.isArray(o.skills))
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  skills?: string | string[];

  @ApiPropertyOptional({ type:"string", description: 'Additional links related to the job' })
  @IsOptional()
  @IsString()
  @IsString({ each: true })
  ExtraLink?: string;

  @ApiPropertyOptional({
    description: 'Source of the job (upskill or external)',
    enum: ['upskill', 'external'],
  })
  @IsOptional()
  @IsEnum(['upskill', 'external'])
  source?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPublic: boolean;
}

// For job.data.ts (database operations)
export interface CreateJobData {
  title: string;
  subtitle: string;
  description: string;
  company: string;
  logo: string;
  skills: string[];
  ExtraLink?: string;
  source?: string;
  isPublic?:boolean;
}

// For job.data.ts (database operations)
export interface UpdateJobData {
  title?: string;
  subtitle?: string;
  description?: string;
  company?: string;
  logo?: string;
  skills?: string[];
  ExtraLink?: string;
  source?: string;
  isPublic?:boolean;
}

export class JobResponse {
  @ApiProperty({ type: String, description: 'Unique identifier for the job' })
  _id: string;

  @ApiProperty({ description: 'Title of the job' })
  title: string;

  @ApiProperty({ description: 'Subtitle or short description of the job' })
  subtitle: string;

  @ApiProperty({ description: 'Detailed description of the job' })
  description: string;

  @ApiProperty({ description: 'Name of the company offering the job' })
  company: string;

  @ApiProperty({ description: 'URL of the company logo' })
  logo: string;

  @ApiProperty({ type: [String], description: 'List of required skills for the job' })
  skills: string[];

  @ApiPropertyOptional({ type:"string" , description: 'Additional links related to the job' })
  ExtraLink?: string;

  @ApiPropertyOptional({
    description: 'Source of the job (upskill or external)',
    enum: ['upskill', 'external'],
  })
  source?: string;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class GetJobsResponseDTO {
  @ApiProperty({ type: [JobResponse], description: 'List of jobs' })
  jobs: JobResponse[];
}
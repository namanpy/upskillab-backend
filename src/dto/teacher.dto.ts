import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mobileNumber?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  qualification: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  expertise: string;

  @ApiPropertyOptional()
  @IsOptional()
  social_links?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  experience?: string;
}

export class Teacher {
  @ApiProperty({
    type: String,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  user: Types.ObjectId | null;

  @ApiProperty()
  name: string;

  @ApiProperty()
  qualification: string;

  @ApiProperty()
  expertise: string;

  @ApiProperty()
  social_links: Record<string, string>;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  experience: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetTeacherRequestDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  skip?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  limit?: number;
}

export class GetTeachersResponseDTO {
  @ApiProperty({ type: [Teacher] })
  teachers: Teacher[];
}
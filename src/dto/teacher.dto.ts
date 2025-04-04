import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user: string; // User ID as a string (ObjectId)

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  qualification: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  expertise: string;

  @ApiProperty()
  @IsOptional()
  social_links?: Record<string, string>;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty()
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
  })
  user: Types.ObjectId;

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

export class GetTeachersResponseDTO {
  @ApiProperty({ type: [Teacher] })
  teachers: Teacher[];
}

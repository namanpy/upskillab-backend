import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId, IsBoolean, IsDate } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tag: string; // Dynamic tag

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  studentId: string; // ID of the student from the students table

  @ApiProperty()
  @IsBoolean()
  approvedByAdmin: boolean;

  @ApiProperty()
  @IsDate()
  approvedAt?: Date; // Optional approval date
}

export class Blog {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  tag: string;

  @ApiProperty()
  studentId: string;

  @ApiProperty()
  studentName: string; // Populated from students table

  @ApiProperty()
  approvedByAdmin: boolean;

  @ApiProperty()
  approvedAt: Date; // Approval date

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetBlogsResponseDTO {
  @ApiProperty({ type: [Blog] })
  blogs: Blog[];
}
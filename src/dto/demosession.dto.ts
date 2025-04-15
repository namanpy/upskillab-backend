import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateDemoSessionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course: string; // Added course field

  @ApiProperty()
  @IsString()
  @IsOptional()
  sourse: string;

  @ApiProperty({ enum: ['Fresher', 'Working Professional'] })
  @IsEnum(['Fresher', 'Working Professional'])
  @IsOptional()
  experience: string; // Added experience field with enum
}

export class DemoSession {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  course: string; // Added course field

  @ApiProperty()
  sourse: string;

  @ApiProperty({ enum: ['Fresher', 'Working Professional'] })
  experience: string; // Added experience field with enum

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetDemoSessionsResponseDTO {
  @ApiProperty({ type: [DemoSession] })
  demoSessions: DemoSession[];
}
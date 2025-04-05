import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

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

  @ApiProperty({ enum: ['Fresher', 'Working Professional'] })
  @IsEnum(['Fresher', 'Working Professional'])
  @IsNotEmpty()
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
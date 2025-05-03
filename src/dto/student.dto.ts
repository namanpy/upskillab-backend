import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentDTO {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  fullName: string;

  @ApiPropertyOptional()
  college?: string;

  @ApiProperty()
  studentType: string;
}
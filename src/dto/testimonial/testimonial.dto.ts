import { ApiProperty } from '@nestjs/swagger';

export class TestimonialDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  rating: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Testimonial } from 'src/schemas/testimonial.schema';

export class GetTestimonialsRequestDTO {}

export class GetTestimonialsResponseDTO {
  @ApiProperty({
    type: [Testimonial],
  })
  testimonials: Testimonial[];
}

import { ApiProperty } from '@nestjs/swagger';

import { TestimonialDTO } from './testimonial.dto';

export class GetTestimonialsRequestDTO {}

export class GetTestimonialsResponseDTO {
  @ApiProperty({
    type: [TestimonialDTO],
  })
  testimonials: TestimonialDTO[];
}

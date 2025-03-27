import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsArray, IsOptional } from 'class-validator';

export class SocialMediaLinkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  platform: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateTestimonialDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  testimonialImageUrl: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: [SocialMediaLinkDto] })
  @IsArray()
  @IsOptional()
  socialMediaLinks?: SocialMediaLinkDto[];
}

export class Testimonial {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  testimonialImageUrl: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [SocialMediaLinkDto] })
  socialMediaLinks: SocialMediaLinkDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetTestimonialsResponseDTO {
  @ApiProperty({ type: [Testimonial] })
  testimonials: Testimonial[];
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsNumber, IsOptional } from 'class-validator';

enum FieldLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  EXPERT = 'expert',
}

export class CreateUniversityCourse2Dto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: FieldLevel, enumName: 'FieldLevel' })
  @IsEnum(FieldLevel)
  fieldLevel: FieldLevel;

  @ApiProperty()
  @IsBoolean()
  active: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  discountedPrice: number;
}

export class UpdateUniversityCourse2Dto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false, enum: FieldLevel, enumName: 'FieldLevel' })
  @IsEnum(FieldLevel)
  @IsOptional()
  fieldLevel?: FieldLevel;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalPrice?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  discountedPrice?: number;
}

export class UniversityCourse2 {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: FieldLevel, enumName: 'FieldLevel' })
  fieldLevel: FieldLevel;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  discountedPrice: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetUniversityCourse2sResponseDTO {
  @ApiProperty({ type: [UniversityCourse2] })
  universityCourses: UniversityCourse2[];
}
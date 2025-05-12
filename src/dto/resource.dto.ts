import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsMongoId } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({ description: 'Title of the resource' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the resource' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'PDF file upload', type: 'string', format: 'binary' })
  @IsOptional()
  pdf?: string;

  @ApiPropertyOptional({ description: 'Image file upload', type: 'string', format: 'binary' })
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ description: 'External link for the resource' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({ description: 'Approval status of the resource' })
  @IsBoolean()
  isApproved: boolean;

  @ApiProperty({ description: 'Tags associated with the resource', type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'Course ID associated with the resource' })
  @IsMongoId()
  courseId: string;
}

export class UpdateResourceDto {
  @ApiPropertyOptional({ description: 'Title of the resource' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Description of the resource' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'PDF file upload', type: 'string', format: 'binary' })
  @IsOptional()
  pdf?: string;

  @ApiPropertyOptional({ description: 'Image file upload', type: 'string', format: 'binary' })
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ description: 'External link for the resource' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ description: 'Approval status of the resource' })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @ApiPropertyOptional({ description: 'Tags associated with the resource', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Course ID associated with the resource' })
  @IsOptional()
  @IsMongoId()
  courseId?: string;
}

export class Resource {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  pdf?: string;

  @ApiProperty()
  image?: string;

  @ApiProperty()
  link?: string;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  courseId: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetResourcesResponseDTO {
  @ApiProperty({ type: [Resource] })
  resources: Resource[];
}
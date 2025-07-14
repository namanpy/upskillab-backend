import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateSuggestionDTO {
  @ApiProperty({ description: 'Title of the suggestion' })
  title: string;

  @ApiPropertyOptional({ description: 'Description of the suggestion' })
  description?: string;

  @ApiProperty({
    description: 'Type of suggestion'
  })
  type: string;

  @ApiProperty({ description: 'Content of the suggestion (URL for POST, ignored for PDF)' })
  content?: string;

  @IsOptional()
  @ApiProperty({ description: 'Reference to the batch' })
  batchId: string;
}

export class UpdateSuggestionDTO {
  @ApiPropertyOptional({ description: 'Title of the suggestion' })
  title?: string;

  @ApiPropertyOptional({ description: 'Description of the suggestion' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Type of suggestion'
  })
  type?: string;

  @ApiPropertyOptional({ description: 'Content of the suggestion (URL for POST, ignored for PDF)' })
  content?: string;

  @ApiPropertyOptional({ description: 'Approval status of the suggestion' })
  isApproved?: boolean;
}

export class SuggestionDTO {
  @ApiProperty({ description: 'Suggestion ID' })
  _id: string;

  @ApiProperty({ description: 'Title of the suggestion' })
  title: string;

  @ApiPropertyOptional({ description: 'Description of the suggestion' })
  description?: string;

  @ApiProperty({ description: 'Type of suggestion' })
  type: string;

  @ApiProperty({ description: 'Content of the suggestion (URL or PDF S3 URL)' })
  content: string;

  @IsOptional()
  @ApiProperty({ description: 'Reference to the batch' })
  batchId: string;

  @ApiProperty({ description: 'Reference to the teacher' })
  teacherId: string;

  @ApiProperty({ description: 'Teacher name' })
  teacherName: string;

  @ApiProperty({ description: 'Approval status of the suggestion' })
  isApproved: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Update timestamp' })
  updatedAt: string;
}

export class GetSuggestionsResponseDTO {
  @ApiProperty({ description: 'List of suggestions', type: [SuggestionDTO] })
  suggestions: SuggestionDTO[];
}
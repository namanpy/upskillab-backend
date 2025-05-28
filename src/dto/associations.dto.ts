import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateAssociationDto {
  @ApiPropertyOptional({ description: 'URL or path to the association logo' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ description: 'Title of the association' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the association' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Whether the association is active' })
  @IsBoolean()
  isActive: boolean;
}

export class UpdateAssociationDto {
  @ApiPropertyOptional({ description: 'URL or path to the association logo' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ description: 'Title of the association' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ description: 'Description of the association' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether the association is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AssociationResponse {
  @ApiProperty({ description: 'Unique identifier for the association' })
  _id: string;

  @ApiPropertyOptional({ description: 'URL or path to the association logo' })
  logo?: string;

  @ApiProperty({ description: 'Title of the association' })
  title: string;

  @ApiProperty({ description: 'Description of the association' })
  description: string;

  @ApiProperty({ description: 'Whether the association is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class GetAssociationsResponseDTO {
  @ApiProperty({ type: [AssociationResponse], description: 'List of associations' })
  associations: AssociationResponse[];
}
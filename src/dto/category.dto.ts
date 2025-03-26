import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ExampleQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional()
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional()
  limit?: number;
}

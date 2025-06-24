import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsBoolean, IsOptional } from 'class-validator';

export class SetReferralDiscountDto {
  @ApiProperty({ example: 10, description: 'Discount percentage (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercentage: number;

  @ApiProperty({ example: 10, description: 'Actived or deactivate' })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}

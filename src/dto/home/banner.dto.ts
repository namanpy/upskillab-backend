import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, Validate, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import WordCountValidator from '../../common/utils/word-count.validator';

export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(WordCountValidator, [6])
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(WordCountValidator, [10])
  subtitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(WordCountValidator, [20])
  description: string;

  @ApiProperty({ type: Boolean })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  active: boolean;
}

export class UpdateBannerDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Validate(WordCountValidator, [6])
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Validate(WordCountValidator, [10])
  subtitle?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Validate(WordCountValidator, [20])
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false, type: Boolean })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class Banner {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  subtitle: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetBannersResponseDTO {
  @ApiProperty({ type: [Banner] })
  banners: Banner[];
}
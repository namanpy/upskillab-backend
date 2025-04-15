import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, Validate, IsOptional } from 'class-validator';
import WordCountValidator from '../../common/utils/word-count.validator';

export class CreateBanner3Dto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(WordCountValidator, [6])
  title: string;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // descriptions: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}

export class UpdateBanner3Dto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Validate(WordCountValidator, [6])
  title?: string;

  // @ApiProperty({ required: false })
  // @IsString()
  // @IsOptional()
  // descriptions?: string;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class Banner3 {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  // @ApiProperty()
  // descriptions: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetBanner3sResponseDTO {
  @ApiProperty({ type: [Banner3] })
  banner3s: Banner3[];
}
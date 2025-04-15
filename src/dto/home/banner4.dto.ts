import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, Validate, IsOptional } from 'class-validator';
import WordCountValidator from '../../common/utils/word-count.validator';

export class CreateBanner4Dto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(WordCountValidator, [6])
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(WordCountValidator, [20])
  descriptions: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}

export class UpdateBanner4Dto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Validate(WordCountValidator, [6])
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Validate(WordCountValidator, [20])
  descriptions?: string;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class Banner4 {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  descriptions: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetBanner4sResponseDTO {
  @ApiProperty({ type: [Banner4] })
  banner4s: Banner4[];
}
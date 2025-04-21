// import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsArray, IsBoolean, Validate, IsNotEmpty, IsOptional } from 'class-validator';
// import WordCountValidator from '../common/utils/word-count.validator';

// export class CreateUniversity2Dto {
//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   imageUrl: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   logoUrl: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   @Validate(WordCountValidator, [20])
//   aboutTitle: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   @Validate(WordCountValidator, [500])
//   aboutDescription: string;

//   @ApiProperty()
//   @IsArray()
//   @IsNotEmpty({ each: true })
//   tags: string[];

//   @ApiProperty()
//   @IsBoolean()
//   @IsOptional()
//   active?: boolean;
// }

// export class University2 {
//   @ApiProperty()
//   _id: string;

//   @ApiProperty()
//   imageUrl: string;

//   @ApiProperty()
//   logoUrl: string;

//   @ApiProperty()
//   name: string;

//   @ApiProperty()
//   aboutTitle: string;

//   @ApiProperty()
//   aboutDescription: string;

//   @ApiProperty()
//   tags: string[];

//   @ApiProperty()
//   active: boolean;

//   @ApiProperty()
//   createdAt: Date;

//   @ApiProperty()
//   updatedAt: Date;
// }

// export class GetUniversity2sResponseDTO {
//   @ApiProperty({ type: [University2] })
//   universities: University2[];
// }

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsBoolean, Validate, IsNotEmpty, IsOptional } from 'class-validator';
import WordCountValidator from '../../common/utils/word-count.validator';

export class CreateUniversity2Dto {
  @ApiPropertyOptional() // Changed to optional
  @IsString()
  @IsOptional() // Added to make it optional
  imageUrl?: string;

  @ApiPropertyOptional() // Changed to optional
  @IsString()
  @IsOptional() // Added to make it optional
  logoUrl?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(WordCountValidator, [20])
  aboutTitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(WordCountValidator, [500])
  aboutDescription: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  tags: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  pageLink: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

export class University2 {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  logoUrl: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  aboutTitle: string;

  @ApiProperty()
  aboutDescription: string;

  @ApiProperty()
  pageLink: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetUniversity2sResponseDTO {
  @ApiProperty({ type: [University2] })
  universities: University2[];
}
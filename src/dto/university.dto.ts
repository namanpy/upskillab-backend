// import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsNotEmpty, IsArray, IsNumber, IsBoolean, IsOptional } from 'class-validator';

// export class CreateUniversityDto {
//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   institutionType: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   deliveryMode: string;

//   @ApiProperty()
//   @IsArray()
//   @IsNotEmpty()
//   programType: string[];

//   @ApiProperty()
//   @IsNumber()
//   @IsNotEmpty()
//   ratings: number;

//   @ApiProperty()
//   @IsNumber()
//   @IsNotEmpty()
//   reviews: number;

//   @ApiProperty()
//   @IsBoolean()
//   @IsOptional()
//   certification: boolean = false;

//   // Remove imageUrl from CreateUniversityDto since it's generated
// }

// export class UpdateUniversityDto {
//   @ApiProperty({ required: false })
//   @IsString()
//   @IsOptional()
//   institutionType?: string;

//   @ApiProperty({ required: false })
//   @IsString()
//   @IsOptional()
//   deliveryMode?: string;

//   @ApiProperty({ required: false })
//   @IsArray()
//   @IsOptional()
//   programType?: string[];

//   @ApiProperty({ required: false })
//   @IsNumber()
//   @IsOptional()
//   ratings?: number;

//   @ApiProperty({ required: false })
//   @IsNumber()
//   @IsOptional()
//   reviews?: number;

//   @ApiProperty({ required: false })
//   @IsBoolean()
//   @IsOptional()
//   certification?: boolean;

//   @ApiProperty({ required: false })
//   @IsString()
//   @IsOptional()
//   imageUrl?: string;
// }

// export class University {
//   @ApiProperty()
//   _id: string;

//   @ApiProperty()
//   institutionType: string;

//   @ApiProperty()
//   deliveryMode: string;

//   @ApiProperty()
//   programType: string[];

//   @ApiProperty()
//   ratings: number;

//   @ApiProperty()
//   reviews: number;

//   @ApiProperty()
//   certification: boolean;

//   @ApiProperty()
//   imageUrl: string;

//   @ApiProperty()
//   createdAt: Date;

//   @ApiProperty()
//   updatedAt: Date;
// }

// export class GetUniversitiesResponseDTO {
//   @ApiProperty({ type: [University] })
//   universities: University[];
// }

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateUniversityDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    institutionType: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    deliveryMode: string;
  
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    programType: string[];
  
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    ratings: number;
  
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    reviews: number;
  
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    certification: boolean = false;
  }
  
  export class UpdateUniversityDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    institutionType?: string;
  
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    deliveryMode?: string;
  
    @ApiProperty({ required: false })
    @IsArray()
    @IsOptional()
    programType?: string[];
  
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    ratings?: number;
  
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    reviews?: number;
  
    @ApiProperty({ required: false })
    @IsBoolean()
    @IsOptional()
    certification?: boolean;
  
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    imageUrl?: string;
  }

export class University {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  institutionType: string;

  @ApiProperty()
  deliveryMode: string;

  @ApiProperty()
  programType: string[];

  @ApiProperty()
  ratings: number;

  @ApiProperty()
  reviews: number;

  @ApiProperty()
  certification: boolean;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetUniversitiesResponseDTO {
  @ApiProperty({ type: [University] })
  universities: University[];
}
// import { ApiProperty } from '@nestjs/swagger';
// import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// export class CreateContactUsDto {
//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   email: string;

//   @ApiProperty({ required: false })
//   @IsString()
//   @IsOptional()
//   number?: string; // Optional field

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   subject: string;

//   @ApiProperty()
//   @IsString()
//   @IsOptional()
//   sourse: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   message: string;
// }

// export class ContactUs {
//   @ApiProperty()
//   _id: string;

//   @ApiProperty()
//   name: string;

//   @ApiProperty()
//   email: string;

//   @ApiProperty({ required: false })
//   number?: string; // Optional field

//   @ApiProperty()
//   subject: string;

//   @ApiProperty()
//   sourse: string;

//   @ApiProperty()
//   message: string;

//   @ApiProperty()
//   createdAt: Date;

//   @ApiProperty()
//   updatedAt: Date;
// }

// export class GetContactUsResponseDTO {
//   @ApiProperty({ type: [ContactUs] })
//   contactUs: ContactUs[];
// }


import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContactUsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  number?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sourse?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class ContactUs {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  number?: string;

  @ApiProperty()
  subject: string;

  @ApiProperty({ required: false })
  sourse?: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetContactUsResponseDTO {
  @ApiProperty({ type: [ContactUs] })
  contactUs: ContactUs[];
}
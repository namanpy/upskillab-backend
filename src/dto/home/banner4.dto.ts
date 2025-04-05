import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateBanner4Dto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}

export class Banner4 {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

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
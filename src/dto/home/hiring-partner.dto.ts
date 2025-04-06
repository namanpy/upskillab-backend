import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateHiringPartnerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}

export class HiringPartner {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetHiringPartnersResponseDTO {
  @ApiProperty({ type: [HiringPartner] })
  hiringPartners: HiringPartner[];
}
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
export class AuthLoginResponseDto {
  @ApiProperty()
  authToken: string;
}

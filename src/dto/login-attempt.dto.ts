 import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
 import { ApiProperty } from '@nestjs/swagger';
 
 export class OtpLoginRequestDto {
   @IsString()
   @IsEmail()
   @IsNotEmpty()
   @ApiProperty()
   email: string;
 }
 export class OtpLoginResponseDto {
   @ApiProperty()
   @IsString()
   @IsNotEmpty()
   attemptId: string;

 }
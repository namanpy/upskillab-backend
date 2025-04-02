import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { User } from 'src/schemas/user.schema';

export class GetUserRequestDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  searchString: string;
}
export class GetUserResponseDTO {
  @ApiProperty({ type: [User] })
  users: User[];
}

export class UpdateUserRequestDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  mobileNumber: string;
}
export class UpdateUserResponseDTO {
  @ApiProperty({ type: User })
  user: User;
}

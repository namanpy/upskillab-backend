import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/schemas/user.schema';

export class GetUserRequestDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @IsOptional()
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @IsOptional()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @IsOptional()
    mobileNumber: string;
    
}
export class GetUserResponseDTO {
    @ApiProperty({ type: [User] })
    users: User[];
}
import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  sender: string;

  @IsNotEmpty()
  doubt: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsArray()
  attachments?: string[];
}

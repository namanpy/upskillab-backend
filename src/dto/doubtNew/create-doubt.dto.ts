import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateDoubtDto {
  @IsNotEmpty()
  student: string;

  @IsNotEmpty()
  teacher: string;

  @IsNotEmpty()
  course: string;

  @IsNotEmpty()
  @IsString()
  question: string;

  @IsOptional()
  @IsArray()
  attachments?: string[];
}

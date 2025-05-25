import { bool } from 'aws-sdk/clients/signer';
import { IsString, MinLength,IsOptional,IsBoolean } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  @MinLength(1)
  message: string;

  @IsBoolean()
  isActive: boolean;
}

export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  message?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
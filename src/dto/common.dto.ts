import { ApiProperty } from '@nestjs/swagger';

export class Constant {
  @ApiProperty()
  code: string;
  @ApiProperty()
  name: string;
}

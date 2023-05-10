import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class CreateMetricDto {
  @IsString()
  @ApiProperty()
  service: string;

  @IsString()
  @ApiProperty()
  command: string;

  @IsDate()
  @ApiProperty()
  timestamp: Date;
}

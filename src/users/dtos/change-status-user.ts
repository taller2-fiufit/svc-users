import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ChangeStatusUserDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  blocked: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsDecimal } from 'class-validator';

export class RecoveryPasswordDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}

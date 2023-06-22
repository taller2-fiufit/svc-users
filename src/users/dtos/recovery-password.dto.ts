import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RecoveryPasswordDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}

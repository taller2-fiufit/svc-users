import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  passRecoveryToken: string;
}

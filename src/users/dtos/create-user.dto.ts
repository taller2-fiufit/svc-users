import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  fullname: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  city: string;

  @IsString()
  @ApiProperty()
  country: string;

  @IsNumber()
  @Max(90.0)
  @Min(-90.0)
  @ApiProperty()
  latitude: number;

  @IsNumber()
  @Max(180.0)
  @Min(-180.0)
  @ApiProperty()
  longitude: number;
}

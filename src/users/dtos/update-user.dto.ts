import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  fullname: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  city: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  country: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  latitude: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  longitude: number;
}

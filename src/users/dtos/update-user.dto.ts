import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsDecimal } from 'class-validator';

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
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  city: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  country: string;

  @IsDecimal()
  @IsOptional()
  @ApiProperty()
  latitude: number;

  @IsDecimal()
  @IsOptional()
  @ApiProperty()
  longitude: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  profileimage: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  pushToken: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';

export class UserDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  fullname: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Exclude()
  isAdmin: boolean;

  @Exclude()
  password: string;

  @Expose()
  @ApiProperty()
  city: string;

  @Expose()
  @ApiProperty()
  country: string;

  @Expose()
  @ApiProperty()
  latitude: number;

  @Expose()
  @ApiProperty()
  longitude: number;

  @Expose()
  @ApiProperty()
  profileimage: string;

  @Expose()
  @ApiProperty()
  blocked: boolean;
}

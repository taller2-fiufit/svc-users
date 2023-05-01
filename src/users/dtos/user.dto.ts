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
  createdAt: Date;

  @Exclude()
  isAdmin: boolean;

  @Exclude()
  password: string;
}

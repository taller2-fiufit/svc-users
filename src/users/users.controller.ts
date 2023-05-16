import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('users')
  async signup(@Body() body: CreateUserDto) {
    return this.authService.signup(
      body.email,
      body.password,
      body.fullname,
      body.description,
      body.city,
      body.country,
      body.latitude,
      body.longitude
    );
  }

  @Post('admin')
  @UseGuards(AuthGuard)
  createAdminUser(@CurrentUser() user: User, @Body() body: CreateAdminDto) {
    if (!user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.authService.createAdmin(
      body.email,
      body.password,
      body.fullname,
    );
  }

  @Get('users/me')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get('users/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get('users')
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}

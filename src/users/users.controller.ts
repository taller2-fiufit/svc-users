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
  Query,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangeStatusUserDto } from './dtos/change-status-user';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('Users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  private readonly logger = new Logger(UsersController.name);

  @Serialize(UserDto)
  @Post('users')
  async signup(@Body() body: CreateUserDto) {
    this.logger.log(`POST /users`);
    return this.authService.signup(
      body.email,
      body.password,
      body.fullname,
      body.description,
      body.city,
      body.country,
      body.latitude,
      body.longitude,
    );
  }

  @Serialize(UserDto)
  @Post('admin')
  @UseGuards(AuthGuard)
  createAdminUser(@CurrentUser() user: User, @Body() body: CreateAdminDto) {
    this.logger.log(`POST /admin`);
    if (!user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.authService.createAdmin(
      body.email,
      body.password,
      body.fullname,
    );
  }

  @Serialize(UserDto)
  @Get('users/me')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    this.logger.log(`GET /users/me`);
    return user;
  }

  
  @Get('users/count')
  @UseGuards(AuthGuard)
  async getUsersCount(@CurrentUser() user: User) {
    this.logger.log(`GET /users/count`);
    if (!user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.usersService.getCount();
  }

  @Serialize(UserDto)
  @Get('users/:id')
  findUser(@Param('id') id: string) {
    this.logger.log(`GET /users/${id}`);
    return this.usersService.findOne(parseInt(id));
  }

  @Serialize(UserDto)
  @Get('users')
  @UseGuards(AuthGuard)
  async findAllUsers(
    @CurrentUser() user: User,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('maxDistance') maxDistance?: number,
  ) {
    this.logger.log(`GET /users`);
    // Return all users
    if (maxDistance === undefined) {
      return this.usersService.findAll();
    }
    // Return only users near received point, up to `maxDistance` Kms
    if (latitude === undefined || longitude === undefined) {
      latitude = user.latitude;
      longitude = user.longitude;
    }
    const result = await this.usersService.findByDistance(
      latitude,
      longitude,
      maxDistance,
    );
    return result.filter((u) => u.id !== user.id);
  }

  @Serialize(UserDto)
  @Delete('users/:id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id') id: string, @CurrentUser() user: User) {
    this.logger.log(`DELETE /users/${id}`);
    if (user.id != parseInt(id) && !user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.usersService.remove(parseInt(id));
  }

  @Serialize(UserDto)
  @Patch('users/:id')
  @UseGuards(AuthGuard)
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    this.logger.log(`PATCH /users/${id}`);
    if (user.id != parseInt(id) && !user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.usersService.update(parseInt(id), body);
  }

  @Serialize(UserDto)
  @Patch('users/:id/status')
  @UseGuards(AuthGuard)
  updateUserStatus(
    @Param('id') id: string,
    @Body() body: ChangeStatusUserDto,
    @CurrentUser() user: User,
  ) {
    this.logger.log(`PATCH /users/${id}/status`);
    if (!user.isAdmin) {
      throw new UnauthorizedException();
    }
    return this.usersService.update(parseInt(id), body);
  }
}

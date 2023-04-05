import { Body, Controller, Post, Get, Param, Query, Delete, Patch, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor'
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {}

    @Post('')
    async signup(@Body() body: CreateUserDto) {
       return this.authService.signup(body.email, body.password, body.fullname);
    }

    @Get('me')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Get(':id')
    findUser(@Param('id') id: string) {
        return this.usersService.findOne(parseInt(id));
    }

    @Get('')
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body)
    }
}
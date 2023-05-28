import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { ApiTags } from '@nestjs/swagger';

@Serialize(UserDto)
@ApiTags('Followers')
@Controller()
export class FollowersController {
  constructor(private usersService: UsersService) {}

  @Post('users/:userId/following/:followeeId')
  @UseGuards(AuthGuard)
  addFollower(
    @Param('userId') userId: number,
    @Param('followeeId') followeeId: number,
    @CurrentUser() user: User,
  ) {
    if (user.id != userId) {
      throw new UnauthorizedException();
    }
    return this.usersService.followUser(userId, followeeId);
  }

  @Get('users/:id/followers')
  getFollowers(@Param('id') id: number) {
    return this.usersService.getFollowers(id);
  }

  @Get('users/:id/following')
  getFollowees(@Param('id') id: number) {
    return this.usersService.getFollowees(id);
  }

  @Delete('users/:userId/following/:followeeId')
  @UseGuards(AuthGuard)
  deleteFollower(
    @Param('userId') userId: number,
    @Param('followeeId') followeeId: number,
    @CurrentUser() user: User,
  ) {
    if (user.id != userId) {
      throw new UnauthorizedException();
    }

    return this.usersService.unfollowUser(userId, followeeId);
  }
}

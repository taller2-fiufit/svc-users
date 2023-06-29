import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../guards/apikey.guard';

@UseGuards(ApiKeyGuard)
@Serialize(UserDto)
@ApiTags('Followers')
@Controller()
export class FollowersController {
  constructor(private usersService: UsersService) {}

  private readonly logger = new Logger(FollowersController.name);

  @Post('users/:userId/following/:followeeId')
  @UseGuards(AuthGuard)
  addFollower(
    @Param('userId') userId: number,
    @Param('followeeId') followeeId: number,
    @CurrentUser() user: User,
  ) {
    this.logger.log(`POST /users/${userId}/following/${followeeId}`);
    if (user.id != userId) {
      throw new UnauthorizedException();
    }
    return this.usersService.followUser(userId, followeeId);
  }

  @Get('users/:id/followers')
  getFollowers(@Param('id') id: number) {
    this.logger.log(`GET /users/${id}/followers`);
    return this.usersService.getFollowers(id);
  }

  @Get('users/:id/following')
  getFollowees(@Param('id') id: number) {
    this.logger.log(`GET /users/${id}/following`);
    return this.usersService.getFollowees(id);
  }

  @Delete('users/:userId/following/:followeeId')
  @UseGuards(AuthGuard)
  deleteFollower(
    @Param('userId') userId: number,
    @Param('followeeId') followeeId: number,
    @CurrentUser() user: User,
  ) {
    this.logger.log(`DELETE /users/${userId}/following/${followeeId}`);
    if (user.id != userId) {
      throw new UnauthorizedException();
    }

    return this.usersService.unfollowUser(userId, followeeId);
  }
}

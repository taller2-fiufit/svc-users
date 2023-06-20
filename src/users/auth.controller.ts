import { Body, Controller, Post, Delete, UseGuards, Req } from '@nestjs/common';
import { SigninUserDto } from './dtos/signin-user.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { GoogleGuard } from '../guards/google.guard';

@Controller('tokens')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('')
  async signin(@Body() body: SigninUserDto) {
    const token = await this.authService.signin(body.email, body.password);
    return token;
  }

  @Post('/google')
  @UseGuards(GoogleGuard)
  async googleLogin(@Req() request: any) {
    return this.authService.googleLogin(request['googleUser']);
  }

  // TODO: Invalidar token
  @Delete('')
  signout() {
    return null;
  }
}

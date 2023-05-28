import { Body, Controller, Get, Post, Delete, UseGuards, Req } from '@nestjs/common';
import { SigninUserDto } from './dtos/signin-user.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard as PassportGuard } from '@nestjs/passport';

@Controller('tokens')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('')
  async signin(@Body() body: SigninUserDto) {
    const token = await this.authService.signin(body.email, body.password);
    return token;
  }

  @Get('google')
  @UseGuards(PassportGuard('google'))
  async googleSignin(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(PassportGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req)
  }

  // TODO: Invalidar token
  @Delete('')
  signout() {
    return null;
  }
}

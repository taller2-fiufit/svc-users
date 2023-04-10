import { Body, Controller, Post, Delete } from '@nestjs/common';
import { SigninUserDto } from './dtos/signin-user.dto';
import { AuthService } from './auth.service';

@Controller('tokens')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('')
  async signin(@Body() body: SigninUserDto) {
    const token = await this.authService.signin(body.email, body.password);
    return token;
  }

  // TODO: Invalidar token
  @Delete('')
  signout() {
    return null;
  }
}

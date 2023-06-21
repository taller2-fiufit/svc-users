import {
  Body,
  Controller,
  Post,
  Delete,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { SigninUserDto } from './dtos/signin-user.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { GoogleGuard } from '../guards/google.guard';

@Controller('tokens')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);

  @Post('')
  async signin(@Body() body: SigninUserDto) {
    this.logger.log(`POST /tokens`);
    const token = await this.authService.signin(body.email, body.password);
    return token;
  }

  @Post('/google')
  @UseGuards(GoogleGuard)
  async googleLogin(@Req() request: any) {
    this.logger.log(`POST /tokens/google`);
    return this.authService.googleLogin(request['googleUser']);
  }

  // TODO: Invalidar token
  @Delete('')
  signout() {
    this.logger.log(`DELETE /tokens`);
    return null;
  }
}

import { Body, Controller, Post, Delete } from '@nestjs/common';
import { SigninUserDto } from './dtos/signin-user.dto';
import { AuthService } from './auth.service';

@Controller('tokens')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}
    
    //TODO: Entregar token
    @Post('')
    async signin(@Body() body: SigninUserDto) {
        const user = await this.authService.signin(body.email, body.password);
        return user;
    }

    // TODO: Invalidar token
    @Delete('')
    signout() {
        return null
    }
}
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { User } from './users.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      //TODO: revisar tema de TTL
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
})
export class UsersModule {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  //TODO: validar que sea la mejor manera y en ese caso ofuscar el pass
  async onModuleInit() {
    const defaultAdmin = await this.userService.find('admin@kinetix.com');
    if (!defaultAdmin.length) {
      this.authService.createAdmin(
        'admin@kinetix.com',
        'admin',
        'Kinetix Admin',
      );
    }
  }
}

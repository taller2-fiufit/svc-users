import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './users.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { ProducerModule } from '../producer/producer.module';
import { FollowersService } from './followers/followers.service';
import { FollowersController } from './followers/followers.controller';

@Module({
  imports: [
    ProducerModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '6000s' },
        };
      },
    }),
  ],
  controllers: [UsersController, AuthController, FollowersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
    FollowersService,
  ],
})
export class UsersModule {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  async onModuleInit() {
    const defaultAdmin = await this.userService.find(
      process.env.DEFAULT_ADMIN_EMAIL,
    );
    if (!defaultAdmin.length) {
      this.authService.createAdmin(
        process.env.DEFAULT_ADMIN_EMAIL,
        process.env.DEFAULT_ADMIN_PASSWORD,
        process.env.DEFAULT_ADMIN_FULLNAME,
      );
    }
  }
}

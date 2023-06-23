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
import { ProducerService } from '../producer/producer.service';
import { FollowersController } from './followers.controller';
import { PassRecoveryController } from './pass-recovery.controller';
import { PassRecoveryService } from './pass-recovery.service';
import { MailingModule } from '../mailing/mailing.module';
import { SendMailService } from '../mailing/send-mail.service';

@Module({
  imports: [
    ProducerModule,
    MailingModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          global: true,
          secret: process.env.JWT_SECRET,
        };
      },
    }),
  ],
  controllers: [
    PassRecoveryController,
    UsersController,
    AuthController,
    FollowersController,
  ],
  providers: [
    UsersService,
    AuthService,
    ProducerService,
    SendMailService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
    PassRecoveryService,
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

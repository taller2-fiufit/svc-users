import { Controller, Logger, Body, Post, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PassRecoveryService } from './pass-recovery.service';
import { RecoveryPasswordDto } from './dtos/recovery-password.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../guards/apikey.guard';

@UseGuards(ApiKeyGuard)
@Controller('users/password')
@ApiTags('Password Recovery')
export class PassRecoveryController {
  constructor(private passRecoveryService: PassRecoveryService) {}

  private readonly logger = new Logger(PassRecoveryController.name);

  @Post('')
  async sendRecoveryMail(@Body() body: RecoveryPasswordDto) {
    try {
      this.logger.log('POST /users/password');
      const user = await this.passRecoveryService.generateRecoveryMail(
        body.email,
      );
      return { message: `Mail enviado a ${user.email}` };
    } catch (e) {
      throw e;
    }
  }

  @Patch('')
  async updatePassword(@Body() body: UpdatePasswordDto) {
    this.logger.log('PATCH /users/password');
    return this.passRecoveryService.updatePass(
      body.passRecoveryToken,
      body.password,
    );
  }
}

import { Controller, Logger, Body, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PassRecoveryService } from './pass-recovery.service';
import { RecoveryPasswordDto } from './dtos/recovery-password.dto';

@Controller('users/password')
@ApiTags('Password Recovery')
export class PassRecoveryController {
    constructor(
        private passRecoveryService: PassRecoveryService,
    ) {}

    private readonly logger = new Logger(PassRecoveryController.name);

    @Post('')
    async sendRecoveryToken(@Body() body: RecoveryPasswordDto) {
        try {
            this.logger.log((`POST /users/password`));
            const user = await this.passRecoveryService.generateRecoveryToken(body.email);
            return {message: `Mail enviado a ${user.email}`}
        } catch (e) {
            throw e;
        }

    }

}

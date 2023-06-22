import { Controller, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PassRecoveryService } from './pass-recovery.service';

@Controller('users/:id/password')
@ApiTags('Password Recovery')
export class PassRecoveryController {
    constructor(
        private passRecoveryService: PassRecoveryService,
    ) {}

    private readonly logger = new Logger(PassRecoveryController.name);

    @Post('')
    async sendRecoveryToken(@Param('id') id: string) {
        try {
            this.logger.log((`POST /users/${id}/password`));
            const user = await this.passRecoveryService.generateRecoveryToken(parseInt(id));
            return {message: `Mail enviado a ${user.email}`}
        } catch (e) {
            throw e;
        }

    }

}

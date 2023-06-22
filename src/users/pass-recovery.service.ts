import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthService } from './auth.service';

@Injectable()
export class PassRecoveryService {
    
    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) {}

    private readonly logger = new Logger(PassRecoveryService.name);

    async generateRecoveryToken(email: string) {
        const users = await this.userService.find(email);
        if (users.length == 0) {
            this.logger.warn(`Usuario con email: ${email} no encontrado`);
            throw new NotFoundException();
        }
        const passRecoveryToken = await this.authService.generateRecoveryToken(users[0].email)
        return await this.userService.update(users[0].id, { passRecoveryToken })
    }
}

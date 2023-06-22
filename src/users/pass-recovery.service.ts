import { Injectable, Logger } from '@nestjs/common';
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

    async generateRecoveryToken(id: number) {
        try {
            const user: User = await this.userService.findOne(id);
            const passRecoveryToken = await this.authService.generateRecoveryToken(user.id)
            return await this.userService.update(user.id, { passRecoveryToken })
        }
        catch (e) {
            throw e
        }
    }
}

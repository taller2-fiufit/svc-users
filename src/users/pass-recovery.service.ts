import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { SendMailService } from '../mailing/send-mail.service';

@Injectable()
export class PassRecoveryService {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private mailService: SendMailService,
  ) {}

  private readonly logger = new Logger(PassRecoveryService.name);

  private PASS_RESET_URL =
    'https://web-reset-password-fedecolangelo.cloud.okteto.net';

  async generateRecoveryMail(email: string) {
    const users = await this.userService.find(email);
    if (users.length == 0) {
      this.logger.warn(`Usuario con email: ${email} no encontrado`);
      throw new NotFoundException();
    }
    const passRecoveryToken = await this.authService.generateRecoveryToken(
      users[0].id,
    );
    const mail = {
      to: users[0].email,
      subject: 'Kinetix - Servicio de Recupero de Contraseñas',
      from: 'fcolangelo@fi.uba.ar',
      html: `<p>Para recuperar su password haga click en el siguiente <a href="${this.PASS_RESET_URL}/?token=${passRecoveryToken}">link</a></p>`,
    };
    this.mailService.send(mail);
    return await this.userService.update(users[0].id, { passRecoveryToken });
  }

  async updatePass(token: string, password: string) {
    this.logger.debug(token);
    try {
      const payload = await this.authService.validateToken(token);
      const user = await this.userService.findOne(payload['sub']);
      if (user.passRecoveryToken != token) {
        this.logger.warn('El token no matchea con el de la base');
        throw new BadRequestException('Token invalido');
      }
      this.userService.update(payload['sub'], {
        password: await this.authService.generatePassword(password),
        passRecoveryToken: null,
      });
      this.logger.log(`Se cambio el password de ${user.email}`);
      return { message: 'Passowrd cambiado exitosamente' };
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('Token invalido');
    }
  }
}

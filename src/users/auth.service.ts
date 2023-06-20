import {
  BadRequestException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { ProducerService } from '../producer/producer.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private producerService: ProducerService,
  ) {}

  async signup(
    email: string,
    password: string,
    fullname: string,
    description: string,
    city: string,
    country: string,
    latitude: number,
    longitude: number,
  ) {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('Email en uso');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const user = await this.userService.create(
      email,
      result,
      fullname,
      false,
      description,
      city,
      country,
      latitude,
      longitude,
    );

    this.producerService.dispatchMetric(
      this.userService.createUserEvent(
        'signinsWithMail',
        this.userService.userToDto(user),
      ),
    );

    return user;
  }

  //TODO: codigo duplicado
  async createAdmin(email: string, password: string, fullname: string) {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('Email en uso');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    return this.userService.create(
      email,
      result,
      fullname,
      true,
      '',
      '',
      '',
      0,
      0,
    );
  }

  async signin(email: string, password: string) {
    try {
      const [user] = await this.userService.find(email);
      if (!user) {
        throw new BadRequestException('Email y password no corresponden');
      }

      if (user.blocked) {
        throw new UnauthorizedException('El usuario se encuentra bloqueado');
      }

      const [salt, storedHash] = user.password.split('.');

      const hash = (await scrypt(password, salt, 32)) as Buffer;

      if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('Email y password no corresponden');
      }

      const payload = { email: user.email, sub: user.id, admin: user.isAdmin };

      this.producerService.dispatchMetric(
        this.userService.createUserEvent(
          'loginsWithMail',
          this.userService.userToDto(user),
        ),
      );

      return { access_token: await this.jwtService.signAsync(payload) };
    } catch (error) {
      throw error;
    }
  }

  async googleLogin(googleUser) {
    if (!googleUser) {
      throw new BadRequestException('Usuario Google Invalido');
    }
    let [user] = await this.userService.find(googleUser.email);
    if (!user) {
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(googleUser.accessToken, salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      user = await this.userService.create(
        googleUser.email,
        result,
        googleUser.firstName + ' ' + googleUser.lastName,
        false,
        '',
        '',
        '',
        null,
        null,
      );
      this.producerService.dispatchMetric(
        this.userService.createUserEvent(
          'signinsWithFederatedId',
          this.userService.userToDto(user),
        ),
      );
    }
    this.producerService.dispatchMetric(
      this.userService.createUserEvent(
        'loginsWithFederatedId',
        this.userService.userToDto(user),
      ),
    );
    const payload = { email: user.email, sub: user.id, admin: user.isAdmin };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}

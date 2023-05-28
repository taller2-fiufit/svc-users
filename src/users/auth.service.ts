import {
  BadRequestException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
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
    return this.userService.create(
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

      return { access_token: await this.jwtService.signAsync(payload) };
    } catch (error) {
      throw error;
    }
  }
  
  async googleLogin(req) {
    if (!req.user) {
      throw new BadRequestException('Usuario Google Invalido');
    }
    console.log(req.user);
    const user = this.userService.find(req.user.email)[0];
    console.log(user);
    if (!user) {
      return "No existe el usuario"
    }
    return user;
  }
}

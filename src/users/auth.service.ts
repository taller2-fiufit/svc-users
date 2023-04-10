import {
  BadRequestException,
  Injectable
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

  async signup(email: string, password: string, fullname: string) {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('email en uso');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    return this.userService.create(email, result, fullname);
  }

  //TODO: codigo duplicado
  async createAdmin(email: string, password: string, fullname: string) {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('email en uso');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    return this.userService.create(email, result, fullname, true);
  }

  async signin(email: string, password: string) {
    try {
      const [user] = await this.userService.find(email);
      if (!user) {
        throw new BadRequestException('email y password no corresponden');
      }
      
      const [salt, storedHash] = user.password.split('.');
  
      const hash = (await scrypt(password, salt, 32)) as Buffer;
      
      if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('email y password no corresponden');
      }
  
      const payload = { email: user.email, sub: user.id };

      return { access_token: await this.jwtService.signAsync(payload) };
    } catch {
      throw new BadRequestException('email y password no corresponden');
    }
  }
}

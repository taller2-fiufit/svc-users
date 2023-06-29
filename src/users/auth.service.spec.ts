import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './users.entity';
import { BadRequestException } from '@nestjs/common';
import { ProducerService } from '../producer/producer.service';
import { CreateMetricDto } from './dtos/create-metric.dto';
import { UserDto } from './dtos/user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: Partial<UsersService>;
  let mockJwtService: Partial<JwtService>;
  let mockProducerService: Partial<ProducerService>;
  let users: User[];

  beforeEach(async () => {
    users = [];
    mockProducerService = {
      dispatchMetric: (metricDto: CreateMetricDto) => {
        return Promise.resolve(metricDto as null);
      },
    };
    mockUsersService = {
      find: (email: string) => {
        const usuariosFiltrados = users.filter((user) => user.email === email);
        return Promise.resolve(usuariosFiltrados);
      },
      create: (
        email: string,
        password: string,
        fullname: string,
        isAdmin = false,
      ) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
          fullname,
          isAdmin,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      createUserEvent: (command: string, userDto: UserDto) => {
        return new CreateMetricDto();
      },
      userToDto: (user: User) => {
        return new UserDto();
      },
    };
    mockJwtService = {
      signAsync: (payload: string | object | Buffer) => {
        return Promise.resolve(payload as string);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          useValue: mockProducerService,
          provide: ProducerService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('puede crear una instancia de AuthService', async () => {
    expect(service).toBeDefined();
  });

  it('crea un usuario con password encryptado y salado', async () => {
    const user = await service.signup(
      'prueba@kinetix.com',
      'Tempora1234',
      'Prueba Kinetix',
      'soy user prueba',
      'Buenos Aires',
      'Argentina',
      0,
      0,
    );
    expect(user.password).not.toEqual('Tempora1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('tira un error si quiero registrar un usuario con un mail existente', async () => {
    await service.signup(
      'prueba@kinetix.com',
      'Otra cosa',
      'Prueba Kinetix',
      'BA',
      'Argentina',
      'soy user prueba',
      0,
      0,
    );
    await expect(
      service.signup(
        'prueba@kinetix.com',
        'Temporal1234',
        'Juan Perez',
        'BA',
        'Argentina',
        'soy user prueba',
        0,
        0,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('tira un error si me logueo con un usuario que no existe', async () => {
    await expect(
      service.signin('prueba@kinexit', 'Temporal1234'),
    ).rejects.toThrow(BadRequestException);
  });

  it('devuelve un token si me logueo con el password correcto y una excepcion en caso contrario', async () => {
    await service.signup(
      'prueba@kinetix.com',
      'Temporal1234',
      'Prueba Kinetix',
      'BA',
      'Argentina',
      'soy user prueba',
      0,
      0,
    );
    const userToken = await service.signin(
      'prueba@kinetix.com',
      'Temporal1234',
    );
    expect(userToken).toBeDefined();
    await expect(
      service.signin('prueba@kinexit', 'Temporal123'),
    ).rejects.toThrow(BadRequestException);
  });

  it('el usuario comun no deberia ser administrador', async () => {
    const user = await service.signup(
      'prueba@kinetix.com',
      'Temporal1234',
      'Prueba Kinetix',
      'soy user prueba',
      'BA',
      'Arg',
      0,
      0,
    );
    expect(user.isAdmin).toBe(false);
  });

  it('el usuario administrador deberia ser administrador', async () => {
    const user = await service.createAdmin(
      'prueba@kinetix.com',
      'Temporal1234',
      'Prueba Kinetix',
    );
    expect(user.isAdmin).toBe(true);
  });

  it('deberia loginear usuarios de google', async () => {
    const user = {
      email: 'prueba@gmail.com',
      firstName: 'Prueba',
      lastName: 'Kinetix',
      accessToken: 'tokenardo',
    };
    const response = service.googleLogin(user);
    expect((await response).access_token).not.toBe(null);
  });
});

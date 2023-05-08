import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './users.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: Partial<UsersService>;
  let mockJwtService: Partial<JwtService>;
  let users: User[];

  beforeEach(async () => {
    users = [];
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
});

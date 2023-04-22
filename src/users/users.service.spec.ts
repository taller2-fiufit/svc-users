import { Test, TestingModule } from '@nestjs/testing';
import { TypeORMTestingModule } from '../../test/typeorm-test.utils';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeORMTestingModule([User]), TypeOrmModule.forFeature([User])],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('puedo crear el servicio de usuarios', async () => {
    expect(service).toBeDefined();
  });

  it('puedo crear un usuario y por defecto no es admin', async () => {
    const user = await service.create(
      'jondoe@kinetix.com',
      'Temporal1234',
      'Normal User',
    );
    expect(user).toBeDefined();
    expect(user.isAdmin).toBe(false);
  });

  it('debe arrojar excpecion cuando quiero encontrar un usuario que no existe', async () => {
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('debe devolver la inforamcion del usuario cuando busco por id valido', async () => {
    const user = await service.create(
      'jondoe@kinetix.com',
      'Temporal1234',
      'Normal User',
    );
    const lookedUpUser = await service.findOne(1);
    expect(user.email).toEqual(lookedUpUser.email);
  });

  it('debe devolver todos los usuarios no administradores', async () => {
    await service.create('jondoe1@kinetix.com', 'Temporal1234', 'Normal User1');
    await service.create('jondoe2@kinetix.com', 'Temporal1234', 'Normal User2');
    await service.create('admin@kinetix.com', 'admin', 'Admin Kinetix', true);
    expect((await service.findAll()).length).toBe(2);
  });

  it('debe acutalizar al usuario', async () => {
    let user = await service.create(
      'jondoe1@kinetix.com',
      'Temporal1234',
      'Normal User1',
    );
    expect(user.email).toBe('jondoe1@kinetix.com');
    user = await service.update(1, { email: 'temporal@kinetix.com' });
    expect(user.email).toBe('temporal@kinetix.com');
  });

  it('debe eliminar al usuario', async () => {
    await service.create('jondoe1@kinetix.com', 'Temporal1234', 'Normal User1');
    const user = await service.findOne(1);
    expect(user.id).toBe(1);
    await service.remove(1);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });
});

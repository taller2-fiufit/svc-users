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

  it('puedo crear un usuario no admin', async () => {
    const user = await service.create(
      'jondoe@kinetix.com',
      'Temporal1234',
      'Normal User',
      false,
      'soy user prueba',
      'BuenosAires',
      'Argentina',
      0,
      0,
    );
    expect(user).toBeDefined();
    expect(user.isAdmin).toBe(false);
  });

  it('debe arrojar excepcion cuando quiero encontrar un usuario que no existe', async () => {
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('debe devolver la inforamcion del usuario cuando busco por id valido', async () => {
    const user = await service.create(
      'jondoe@kinetix.com',
      'Temporal1234',
      'Normal User',
      false,
      'soy user prueba',
      'BuenosAires',
      'Argentina',
      0,
      0,
    );
    const lookedUpUser = await service.findOne(1);
    expect(user.email).toEqual(lookedUpUser.email);
  });

  it('debe devolver todos los usuarios no administradores', async () => {
    await service.create(
      'jondoe1@kinetix.com',
      'Temporal1234',
      'Normal User1',
      false,
      'soy user prueba',
      'Buenos Aires',
      'Argentina',
      0,
      0,
    );
    await service.create(
      'jondoe2@kinetix.com',
      'Temporal1234',
      'Normal User2',
      false,
      'soy user prueba',
      'Buenos Aires',
      'Argentina',
      0,
      0,
    );
    await service.create(
      'admin@kinetix.com',
      'admin',
      'Admin Kinetix',
      true,
      null,
      null,
      null,
      null,
      null,
    );
    expect((await service.findAll()).length).toBe(2);
  });

  it('debe actualizar al usuario', async () => {
    let user = await service.create(
      'jondoe1@kinetix.com',
      'Temporal1234',
      'Normal User1',
      false,
      'soy user prueba',
      'BuenosAires',
      'Argentina',
      0,
      0,
    );
    expect(user.email).toBe('jondoe1@kinetix.com');
    user = await service.update(1, { email: 'temporal@kinetix.com' });
    expect(user.email).toBe('temporal@kinetix.com');
  });

  it('debe eliminar al usuario', async () => {
    await service.create(
      'jondoe1@kinetix.com',
      'Temporal1234',
      'Normal User1',
      false,
      'soy user prueba',
      'Buenos Aires',
      'Argentina',
      0,
      0,
    );
    const user = await service.findOne(1);
    expect(user.id).toBe(1);
    await service.remove(1);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('has to return users nearer than X kms, ordered by distance', async () => {
    await service.create(
      'jondoe1@kinetix.com',
      'Temporal1234',
      'Normal User1',
      false,
      'soy user prueba',
      'Buenos Aires',
      'Argentina',
      0.0,
      0.0,
      '',
    );
    await service.create(
      'jondoe2@kinetix.com',
      'Temporal1234',
      'Normal User2',
      false,
      'soy user prueba',
      'Buenos Aires',
      'Argentina',
      0.1,
      0,
      '',
    );
    await service.create(
      'jondoe3@kinetix.com',
      'Temporal1234',
      'Normal User2',
      false,
      'soy user prueba',
      'Buenos Aires',
      'Argentina',
      32.0,
      15.0,
      '',
    );
    const result = await service.findByDistance(0.0, 0.0, 20.0);
    expect(result.length).toBe(2);
    expect(result[0].email).toBe('jondoe1@kinetix.com');
    expect(result[1].email).toBe('jondoe2@kinetix.com');
  });

  it('devuelve la cantidad correcta de usuarios', async () => {
    let count = await service.getCount();
    expect(count.count).toBe(0);
    await service.create(
      'jondoe3@kinetix.com',
      'Temporal1234',
      'Normal User2',
      false,
      'soy user prueba',
      'Buenos Aires',
      'Argentina',
      32.0,
      15.0,
      '',
    );
    count = await service.getCount();
    expect(count.count).toBe(1);
  });

  it('pushToken es null por default y puede ser cambiado', async () => {
    let user = await service.create(
      'jondoe2@kinetix.com',
      'Temporal1234',
      'Normal User2',
      false,
      'soy user prueba',
      'Buenos Aires',
      'Argentina',
      0.1,
      0,
      '',
    );
    expect(user.pushToken).toBeNull();
    await service.update(user.id, { pushToken: 'prueba' });
    user = await service.findOne(user.id);
    expect(user.pushToken).toBe('prueba');
  });

  it('deberia gestionar followers', async () => {
    const user1 = await service.create(
      'jondoe1@kinetix.com',
      'Temporal1234',
      'Normal User2',
      false,
      'soy user prueba',
      'Buenos Aires',
      'Argentina',
      0.1,
      0,
      '',
    );
    const user2 = await service.create(
      'jondoe2@kinetix.com',
      'Temporal1234',
      'Normal User2',
      false,
      'soy user prueba',
      'Buenos Aires',
      'Argentina',
      0.1,
      0,
      '',
    );
    await service.followUser(user1.id, user2.id);
    expect((await service.getFollowers(user1.id)).length).toBe(0);
    expect((await service.getFollowers(user2.id)).length).toBe(1);
    expect((await service.getFollowees(user1.id)).length).toBe(1);
    expect((await service.getFollowees(user2.id)).length).toBe(0);
    await service.unfollowUser(user1.id, user2.id);
    expect((await service.getFollowers(user2.id)).length).toBe(0);
    expect((await service.getFollowees(user1.id)).length).toBe(0);
  });
});

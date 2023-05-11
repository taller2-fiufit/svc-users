import { Test, TestingModule } from '@nestjs/testing';
import { TypeORMTestingModule } from '../../test/typeorm-test.utils';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { ProducerService } from '../producer/producer.service';
import { CreateMetricDto } from './dtos/create-metric.dto';

describe('UsersService', () => {
  let service: UsersService;
  let mockProducerService: Partial<ProducerService>;

  beforeEach(async () => {
    mockProducerService = {
      dispatchMetric: (metricDto: CreateMetricDto) => {
        return Promise.resolve(metricDto as null);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeORMTestingModule([User]), TypeOrmModule.forFeature([User])],
      providers: [
        UsersService,
        {
          useValue: mockProducerService,
          provide: ProducerService,
        },
      ],
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
      ''
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
      false,
      'soy user prueba',
      'BuenosAires',
      'Argentina',
      0,
      0,
      ''
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
      ''
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
      ''
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
      ''
    );
    expect((await service.findAll()).length).toBe(2);
  });

  it('debe acutalizar al usuario', async () => {
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
      ''
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
      ''
    );
    const user = await service.findOne(1);
    expect(user.id).toBe(1);
    await service.remove(1);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });
});

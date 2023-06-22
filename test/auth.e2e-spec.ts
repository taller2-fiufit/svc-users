import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { User } from './../src/users/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Sistema de Autenticación', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersRepository = app.get(getRepositoryToken(User));
    await usersRepository.delete({});
    await app.init();
  });

  it('maneja la creación de usuarios', async () => {
    const EMAIL = 'prueba@kinetix.com';
    const FULLNAME = 'Prueba Kinetix';
    const PASSWORD = 'Temporal1234';
    const DESCRIPTION = '';
    const CITY = 'Buenos Aires';
    const COUNTRY = 'Argentina';
    const LATITUDE = 37.5;
    const LONGITUDE = -37.5;

    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: EMAIL,
        password: PASSWORD,
        fullname: FULLNAME,
        description: DESCRIPTION,
        city: CITY,
        country: COUNTRY,
        latitude: LATITUDE,
        longitude: LONGITUDE,
      })
      .expect(201)
      .then((res) => {
        const { id, email, fullname } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(EMAIL);
        expect(fullname).toEqual(FULLNAME);
      });
  });

  it('creo un nuevo usuario y luego obtengo su información', async () => {
    const EMAIL = 'prueba@kinetix.com';
    const FULLNAME = 'Prueba Kinetix';
    const PASSWORD = 'Temporal1234';
    const DESCRIPTION = '';
    const CITY = 'Buenos Aires';
    const COUNTRY = 'Argentina';
    const LATITUDE = 37.5;
    const LONGITUDE = -37.5;

    await request(app.getHttpServer())
      .post('/users')
      .send({
        email: EMAIL,
        password: PASSWORD,
        fullname: FULLNAME,
        description: DESCRIPTION,
        city: CITY,
        country: COUNTRY,
        latitude: LATITUDE,
        longitude: LONGITUDE,
      })
      .expect(201);

    let response = await request(app.getHttpServer())
      .post('/tokens')
      .send({ email: EMAIL, password: PASSWORD })
      .expect(201);

    const token = response.body['access_token'];
    expect(token).toBeDefined;

    response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    expect(response.body['email']).toEqual(EMAIL);
  });

  it('puedo modificar a un usuario creado', async () => {
    const EMAIL = 'prueba@kinetix.com';
    const FULLNAME = 'Prueba Kinetix';
    const PASSWORD = 'Temporal1234';
    const DESCRIPTION = '';
    const CITY = 'Buenos Aires';
    const COUNTRY = 'Argentina';
    const LATITUDE = 37.5;
    const LONGITUDE = -37.5;

    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: EMAIL,
        password: PASSWORD,
        fullname: FULLNAME,
        description: DESCRIPTION,
        city: CITY,
        country: COUNTRY,
        latitude: LATITUDE,
        longitude: LONGITUDE,
      })
      .expect(201)
      .then((res) => {
        const { id, email, fullname } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(EMAIL);
        expect(fullname).toEqual(FULLNAME);
      });
  });

  it('creo un nuevo usuario y puedo modificar su push token', async () => {
    const EMAIL = 'prueba@kinetix.com';
    const FULLNAME = 'Prueba Kinetix';
    const PASSWORD = 'Temporal1234';
    const DESCRIPTION = '';
    const CITY = 'Buenos Aires';
    const COUNTRY = 'Argentina';
    const LATITUDE = 37.5;
    const LONGITUDE = -37.5;
    const PUSH_TOKEN = 'prueba'

    await request(app.getHttpServer())
      .post('/users')
      .send({
        email: EMAIL,
        password: PASSWORD,
        fullname: FULLNAME,
        description: DESCRIPTION,
        city: CITY,
        country: COUNTRY,
        latitude: LATITUDE,
        longitude: LONGITUDE,
      })
      .expect(201);

    let response = await request(app.getHttpServer())
      .post('/tokens')
      .send({ email: EMAIL, password: PASSWORD })
      .expect(201);

    const token = response.body['access_token'];
    expect(token).toBeDefined;

    response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', 'Bearer ' + token)

    const userId = response.body['id']

    response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', 'Bearer ' + token)
      .send({ pushToken: PUSH_TOKEN})
      .expect(200)

    expect(response.body['pushToken']).toBe(PUSH_TOKEN)
  })

  it('creo un nuevo usuario y luego puedo borrarlo', async () => {
    const EMAIL = 'prueba@kinetix.com';
    const FULLNAME = 'Prueba Kinetix';
    const PASSWORD = 'Temporal1234';
    const DESCRIPTION = '';
    const CITY = 'Buenos Aires';
    const COUNTRY = 'Argentina';
    const LATITUDE = 37.5;
    const LONGITUDE = -37.5;

    await request(app.getHttpServer())
      .post('/users')
      .send({
        email: EMAIL,
        password: PASSWORD,
        fullname: FULLNAME,
        description: DESCRIPTION,
        city: CITY,
        country: COUNTRY,
        latitude: LATITUDE,
        longitude: LONGITUDE,
      })
      .expect(201);

    let response = await request(app.getHttpServer())
      .post('/tokens')
      .send({ email: EMAIL, password: PASSWORD })
      .expect(201);

    const token = response.body['access_token'];
    expect(token).toBeDefined;

    response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/users/${response.body['id']}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)

    await request(app.getHttpServer())
      .get(`/users/${response.body['id']}`)
      .expect(404)
  });
});

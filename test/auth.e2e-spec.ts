import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Sistema de Autenticación', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('maneja la creación de usuarios', async () => {
    const EMAIL = 'prueba@kinetix.com';
    const FULLNAME = 'Prueba Kinetix';
    const PASSWORD = 'Temporal1234';

    return request(app.getHttpServer())
      .post('/users')
      .send({ email: EMAIL, password: PASSWORD, fullname: FULLNAME })
      .expect(201)
      .then((res) => {
        const { id, email, fullname } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(EMAIL);
        expect(fullname).toEqual(FULLNAME);
      })
  });
});
import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeORMTestingModule = (entities: any[]) =>
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities: [...entities],
    synchronize: true,
    dropSchema: true,
    logging: false,
  });

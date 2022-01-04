import { MikroORM } from '@mikro-orm/core';

const initDb = async () => {
  const orm = await MikroORM.init({
    entitiesTs: ['./src/database/entities/**/*.ts'],
    entities: ['./dist/database/entities/**/*.js'],
    type: 'sqlite',
    dbName: 'database.sqlite'
  });

  const generator = orm.getSchemaGenerator();
  const deleteAndCreate = await generator.generate();
  await generator.execute(deleteAndCreate);

  return orm;
};

export default initDb;

export { Log } from './entities/Log';

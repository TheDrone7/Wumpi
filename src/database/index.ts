import { MikroORM } from '@mikro-orm/core';

const initDb = async () => {
  const orm = await MikroORM.init({
    entitiesTs: ['./src/database/entities/**/*.ts'],
    entities: ['./dist/database/entities/**/*.js'],
    type: 'sqlite',
    dbName: 'database.sqlite'
  });

  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();

  return orm;
};

export default initDb;

export { Log } from './entities/Log';
export { Lockdown } from './entities/Lockdown';
export { Permission } from './entities/Permission';
export { Settings } from './entities/Setting';
export { ModeratorLog } from './entities/ModeratorLog';
export { Ticket } from './entities/Ticket';
export { Warnings } from './entities/Warning';

export * from './utilities';

import { MikroORM } from '@mikro-orm/core';

const initDb = async () => {
  const orm = await MikroORM.init({
    entitiesTs: ['./src/database/entities/**/*.ts'],
    entities: ['./dist/database/entities/**/*.js'],
    type: 'postgresql',
    clientUrl: process.env.DB_URL
  });

  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();

  return orm;
};

export default initDb;

export { Logs } from './entities/Log';
export { Lockdowns } from './entities/Lockdown';
export { Permissions } from './entities/Permission';
export { Settings } from './entities/Setting';
export { ModeratorLogs } from './entities/ModeratorLog';
export { Tickets } from './entities/Ticket';
export { Warnings } from './entities/Warning';
export { Automod } from './entities/Automod';
export { Welcome } from './entities/Welcome';

export * from './utilities';

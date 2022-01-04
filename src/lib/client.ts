import { container, SapphireClient } from '@sapphire/framework';
import initDb from '../database';
import Logger from './logger.js';
import config from './config';

export default class WumpiClient extends SapphireClient {
  constructor() {
    super(config);

    container.client = this;

    this.fetchPrefix = () => 'w-';

    initDb().then((db) => {
      container.db = db;
      container.log = new Logger(db);
    });
  }
}

import { container, SapphireClient } from '@sapphire/framework';
import initDb from '../database';
import Logger from './logger.js';
import config from './config';
import { Collection } from 'discord.js';

export default class WumpiClient extends SapphireClient {
  constructor() {
    super(config);

    container.client = this;
    container.settings = new Collection();
    container.automod = new Collection();
    container.filters = new Collection();

    this.fetchPrefix = () => 'w-';

    initDb().then((db) => {
      container.db = db;
      container.logger = new Logger(db);
    });
  }
}

import WumpiLogger from './logger';
import { MikroORM } from '@mikro-orm/core';

declare module '@sapphire/pieces' {
  interface Container {
    log: WumpiLogger;
    db: MikroORM;
  }
}

declare module '@sapphire/framework' {
  interface CommandOptions {
    category: string;
    syntax?: string;
  }
}

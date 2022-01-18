import { MikroORM } from '@mikro-orm/core';
import type { Collection, Snowflake } from 'discord.js';
import { Automod, Settings } from '../database';
import Filter from './filter';

declare module '@sapphire/pieces' {
  interface Container {
    db: MikroORM;
    settings: Collection<Snowflake, Settings>;
    automod: Collection<Snowflake, Automod>;
    filters: Collection<Snowflake, Filter>;
  }
}

declare module '@sapphire/framework' {
  interface CommandOptions {
    category: string;
    syntax?: string;
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never;
    SupportEnabled: never;
  }
}

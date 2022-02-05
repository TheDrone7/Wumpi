import { MikroORM } from '@mikro-orm/core';
import type { Collection, Snowflake } from 'discord.js';
import { Automod, Settings } from '../database';

declare module '@sapphire/pieces' {
  interface Container {
    db: MikroORM;
    settings: Collection<Snowflake, Settings>;
    automod: Collection<Snowflake, Automod>;
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

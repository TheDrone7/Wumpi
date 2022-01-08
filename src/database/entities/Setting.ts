import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Settings {
  @PrimaryKey()
  guildId!: string;

  @Property()
  supportCategory?: string;

  @Property()
  supportChannels?: string[] = [];

  @Property()
  supportMessage?: string;

  @Property()
  ticketLogs?: string;

  @Property()
  joinLogs?: string;

  @Property()
  moderatorLogs?: string;

  @Property()
  messageLogs?: string;

  @Property()
  suggestions?: string[];

  @Property()
  botOnly?: string[];

  @Property()
  userOnly?: string[];

  @Property()
  imageOnly?: string[];
}

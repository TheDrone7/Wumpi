import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Settings {
  @PrimaryKey()
  guildId!: string;

  @Property({ nullable: true })
  supportCategory?: string;

  @Property({ nullable: true })
  supportChannels?: string[] = [];

  @Property({ nullable: true })
  supportMessage?: string;

  @Property({ nullable: true })
  ticketLogs?: string;

  @Property({ nullable: true })
  joinLogs?: string;

  @Property({ nullable: true })
  moderatorLogs?: string;

  @Property({ nullable: true })
  messageLogs?: string;

  @Property({ nullable: true })
  suggestions?: string[];

  @Property({ nullable: true })
  userOnly?: string[];

  @Property({ nullable: true })
  botChannel?: string;
}

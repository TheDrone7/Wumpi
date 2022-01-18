import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Automod {
  @PrimaryKey()
  guildId!: string;

  @Property({ nullable: true })
  staff?: string;

  @Property()
  blacklist: string[] = [];

  @Property()
  ignoreBlacklist: string[] = [];

  @Property({ nullable: true })
  ratelimitCount?: number;

  @Property({ nullable: true })
  ratelimitDuration?: number;

  @Property()
  ignoreRatelimit: string[] = [];

  @Property({ nullable: true })
  capitalsLimit?: number;

  @Property({ nullable: true })
  emojisLimit?: number;

  @Property()
  ignoreSpam: string[] = [];

  @Property()
  ignoreInvite: string[] = [];
}

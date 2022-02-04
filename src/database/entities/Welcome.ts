import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Welcome {
  @PrimaryKey()
  guildId!: string;

  @Property()
  message!: string;

  @Property()
  channelId!: string;

  @Property({ nullable: true })
  image?: string;
}

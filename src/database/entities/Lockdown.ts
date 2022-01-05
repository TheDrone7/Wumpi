import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Lockdown {
  @PrimaryKey()
  guildId!: string;

  @Property()
  endTime!: number;
}

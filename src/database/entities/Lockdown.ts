import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Lockdowns {
  @PrimaryKey()
  guildId!: string;

  @Property()
  endTime!: number;
}

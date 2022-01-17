import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Notes {
  @PrimaryKey()
  id!: number;

  @Property()
  userId!: string;

  @Property()
  guildId!: string;

  @Property()
  note!: string;
}

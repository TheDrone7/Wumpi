import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Warnings {
  @PrimaryKey()
  id!: number;

  @Property()
  userId!: string;

  @Property()
  moderatorId!: string;

  @Property()
  guildId!: string;

  @Property()
  reason!: string;
}

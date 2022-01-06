import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Ticket {
  @PrimaryKey()
  id!: number;

  @Property()
  userId!: string;

  @Property()
  topic!: string;

  @Property()
  status!: string;

  @Property()
  messages!: string[];
}

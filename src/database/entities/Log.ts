import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Logs {
  @PrimaryKey()
  id!: number;

  @Property()
  message!: string;

  @Property()
  kind!: string;

  @Property()
  timestamp!: string;
}

import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class ModeratorLog {
  @PrimaryKey()
  id!: number;

  @Property()
  userId!: string;

  @Property()
  moderatorId!: string;

  @Property()
  action!: string;

  @Property()
  reason!: string;
}

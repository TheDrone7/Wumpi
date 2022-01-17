import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class ModeratorLogs {
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

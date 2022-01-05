import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Permission {
  @PrimaryKey()
  id!: string;

  @Property()
  perms!: string;
}

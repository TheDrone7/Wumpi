import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Permissions {
  @PrimaryKey()
  id!: string;

  @Property()
  perms!: string;
}

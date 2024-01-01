import {
  index,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    password: varchar('password', { length: 256 }).notNull(),
  },
  (users) => {
    return {
      emailIndex: uniqueIndex('email_index').on(users.email),
      nameIndex: index('name_index').on(users.name),
    };
  },
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

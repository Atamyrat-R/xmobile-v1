import {
  index,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
  integer,
  date,
} from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  image_url: varchar('image_url', { length: 255 }).notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

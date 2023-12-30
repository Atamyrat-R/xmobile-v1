import {
  index,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
  integer,
  date,
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

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  image_url: varchar('image_url', { length: 255 }).notNull(),
});

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  customer_id: uuid('customer_id').notNull(),
  amount: integer('amount').notNull(),
  status: varchar('status', { length: 255 }).notNull(),
  date: date('date').defaultNow(),
});

export const revenue = pgTable('revenue', {
  month: varchar('month', { length: 4 }).notNull().unique(),
  revenue: integer('revenue').notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

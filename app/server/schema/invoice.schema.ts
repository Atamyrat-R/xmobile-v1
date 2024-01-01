import {
  index,
  pgTable,
  uniqueIndex,
  uuid,
  varchar,
  integer,
  date,
} from 'drizzle-orm/pg-core';

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  customer_id: uuid('customer_id').notNull(),
  amount: integer('amount').notNull(),
  status: varchar('status', { length: 255 }).notNull(),
  date: date('date').defaultNow(),
});

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

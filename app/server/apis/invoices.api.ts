import { Invoice, Customer } from '@/app/lib/definitions';
import { ITEMS_PER_PAGE, ResponseType } from '@/app/server/common';
import { dbClient } from '@/app/server/dbClient';
import { customers } from '@/app/server/schema/customer.schema';
import { invoices } from '@/app/server/schema/invoice.schema';
import { eq, desc, or, ilike, count, sql } from 'drizzle-orm';
import { Column, ColumnBaseConfig } from 'drizzle-orm/column';
import { ColumnDataType } from 'drizzle-orm/column-builder';

import { unstable_noStore as noStore } from 'next/cache';

export async function getLatestInvoices(): Promise<
  (Partial<Invoice> & Partial<Customer>)[] | undefined
> {
  try {
    return await dbClient
      .select({
        amount: invoices.amount,
        name: customers.name,
        image_url: customers.image_url,
        email: customers.email,
        id: invoices.id,
      })
      .from(invoices)
      .innerJoin(customers, eq(invoices.customer_id, customers.id))
      .orderBy(desc(invoices.date))
      .limit(5);
  } catch (error) {
    console.log((error as Error).message);
  }
}

export async function getFilteredInvoices(query: string, currentPage: number) {
  const offset = (Number(currentPage) - 1) * ITEMS_PER_PAGE;

  noStore();

  try {
    return await dbClient
      .select({
        id: invoices.id,
        amount: invoices.amount,
        date: invoices.date,
        status: invoices.status,
        name: customers.name,
        email: customers.email,
        image_url: customers.image_url,
      })
      .from(invoices)
      .innerJoin(customers, eq(invoices.customer_id, customers.id))
      .where(
        or(
          ilike(customers.name, `%${query}%`),
          ilike(customers.email, `%${query}%`),
          // sql`cast(invoices.amount as varchar) ilike '%%'`,
          // sql`cast(invoices.date as varchar) ilike '%cast(${query} as varchar)%'`,
          ilike(invoices.status, `%${query}%`),
        ),
      )
      .orderBy(desc(invoices.date))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);
  } catch (error) {
    console.log((error as Error).message);
  }
}

export async function getTotalInvoices(query: string) {
  noStore();

  try {
    const number = await dbClient
      .select({ count: count(invoices.id) })
      .from(invoices)
      .innerJoin(customers, eq(invoices.customer_id, customers.id))
      .where(
        or(
          ilike(customers.name, `%${query}%`),
          ilike(customers.email, `%${query}%`),
          // ilike(invoices.amount, `%${query}%`),
          // ilike(invoices.date, `%${query}%`),
          ilike(invoices.status, `%${query}%`),
        ),
      );

    const totalPages = Math.ceil(Number(number[0]!.count) / ITEMS_PER_PAGE); // PROBABLY THE ERROR IS FROM HERE
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

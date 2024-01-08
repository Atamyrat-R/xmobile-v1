'use server';

import { dbClient } from '@/app/server/utils/dbClient';
import { customers } from '@/app/server/schema/customer.schema';
import { asc } from 'drizzle-orm';

export async function getCustomers() {
  try {
    const data = await dbClient
      .select({
        id: customers.id,
        name: customers.name,
      })
      .from(customers)
      .orderBy(asc(customers.name));

    return data;
  } catch (err) {
    console.log('Database Error: ' + err);
    throw new Error('Failed to fetch all customers');
  }
}

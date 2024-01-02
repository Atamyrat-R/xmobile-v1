import { dbClient } from '@/app/server/dbClient';
import { customers } from '@/app/server/schema/customer.schema';
import { invoices } from '@/app/server/schema/invoice.schema';
import { count, eq } from 'drizzle-orm';

export async function getCardData() {
  try {
    const numberOfInvoices = await dbClient
      .select({ value: count() })
      .from(invoices);
    const numberOfCustomers = await dbClient
      .select({ value: count() })
      .from(customers);
    const totalPaidInvoices = await dbClient
      .select({ value: count() })
      .from(invoices)
      .where(eq(invoices.status, 'paid'));
    const totalPendingInvoices = await dbClient
      .select({ value: count() })
      .from(invoices)
      .where(eq(invoices.status, 'pending'));

    return {
      numberOfInvoices: numberOfInvoices[0]!.value,
      numberOfCustomers: numberOfCustomers[0]!.value,
      totalPaidInvoices: totalPaidInvoices[0]!.value,
      totalPendingInvoices: totalPendingInvoices[0]!.value,
    };
  } catch (error) {
    console.log((error as Error).message);
    return {};
  }
}

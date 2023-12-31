import { Customer, Invoice, Revenue } from '@/app/lib/definitions';
import { dbClient } from '@/app/server/dbClient';
import {
  NewUser,
  User,
  customers,
  invoices,
  revenue,
  users,
} from '@/app/server/schema';
import { count, desc, eq, ilike, or } from 'drizzle-orm';

const ITEMS_PER_PAGE = 6;

type ResponseType = {
  success: boolean;
  message?: string;
};

export async function createUser({
  email,
  name,
  password,
}: NewUser): Promise<ResponseType & { data?: User }> {
  try {
    const newUser = await dbClient
      .insert(users)
      .values({ name, email, password })
      .returning();
    return {
      success: true,
      data: newUser[0],
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export async function getUser(
  userId: string,
): Promise<ResponseType & { data?: User }> {
  try {
    const user: User[] = await dbClient
      .select()
      .from(users)
      .where(eq(users.id, userId as string));
    return {
      success: true,
      data: user[0],
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export async function getRevenue(): Promise<
  ResponseType & { data?: Revenue[] }
> {
  try {
    const revenues = await dbClient.select().from(revenue);
    return {
      success: true,
      data: revenues,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export async function getLatestInvoices(): Promise<
  ResponseType & { data?: (Partial<Invoice> & Partial<Customer>)[] }
> {
  try {
    const latestInvoices = await dbClient
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

    return {
      success: true,
      data: latestInvoices,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

export async function getInvoices(query: string, currentPage: number) {
  const offset = (Number(currentPage) - 1) * ITEMS_PER_PAGE;

  try {
    const invoicesData = await dbClient
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
          // ilike(invoices.amount, `%${query}%`),
          // ilike(invoices.date, `%${query}%`),
          // ilike(invoices.status, `%${query}%`)
        ),
      )
      .orderBy(desc(invoices.date))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return {
      success: true,
      data: invoicesData,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

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
      success: true,
      data: {
        numberOfInvoices: numberOfInvoices[0]!.value,
        numberOfCustomers: numberOfCustomers[0]!.value,
        totalPaidInvoices: totalPaidInvoices[0]!.value,
        totalPendingInvoices: totalPendingInvoices[0]!.value,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

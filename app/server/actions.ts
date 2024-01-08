'use server';

import { CreateInvoiceForm } from '@/app/server/formSchemas';
import { invoices } from '@/app/server/schema/invoice.schema';
import { dbClient } from '@/app/server/utils/dbClient';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createInvoice(formData: FormData) {
  const CreateInvoice = CreateInvoiceForm.omit({ id: true, date: true });

  const rawFormData = Object.fromEntries(formData.entries());

  const { customerId, amount, status } = CreateInvoice.parse(rawFormData);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  console.log(customerId, amount, status);

  try {
    await dbClient.insert(invoices).values({
      customer_id: customerId,
      amount: amountInCents,
      status: status,
      date: date,
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create a new Invoice');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

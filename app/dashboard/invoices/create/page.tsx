import { getCustomers } from '@/app/server/apis/customers.api';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/invoices/create-form';

export default async function Page() {
  const customers = await getCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Invoices',
            href: 'dashboard/invoices',
          },
          {
            label: 'Create Invoice',
            href: 'dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}

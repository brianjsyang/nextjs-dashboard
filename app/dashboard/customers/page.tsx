import { Metadata } from 'next';
import  CustomersTable from '@/app/ui/customers/table'
import { fetchFormattedCustomers } from '@/app/lib/data';


 
// Metadata of child will override the parent metadata - this allows custom metadata for each page!
export const metadata: Metadata = {
  title: 'Customers',    // because of the title template in the layout.tsx, the Metatitle of this page will be "Invoices | Acme Dashboard"
};

export default async function Page({ searchParams }: { searchParams ?: {query?: string; page?: string;} }) {
  const query = searchParams?.query || '';
  const customers_array = await fetchFormattedCustomers(query);

   return (
      <CustomersTable customers={customers_array} />
   )
}
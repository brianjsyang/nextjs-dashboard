import { Metadata } from 'next';
 
// Metadata of child will override the parent metadata - this allows custom metadata for each page!
export const metadata: Metadata = {
  title: 'Customers',    // because of the title template in the layout.tsx, the Metatitle of this page will be "Invoices | Acme Dashboard"
};

export default function Page() {
    return <p>Page for the customers</p>
}
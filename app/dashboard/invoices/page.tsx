import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';
 
// Metadata of child will override the parent metadata - this allows custom metadata for each page!
export const metadata: Metadata = {
  title: 'Invoices'   // because of the title template in the layout.tsx, the Metatitle of this page will be "Invoices | Acme Dashboard"
};
 
export default async function Page({ searchParams }: { searchParams ?: {query?: string; page?: string;} }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = await fetchInvoicesPages(query); // return number of pages when querying.

    return (
    <div className="w-full">
        <div className="flex w-full items-center justify-between">
            <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
        </div>
        
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <Search placeholder="Search invoices..." />
            <CreateInvoice />
        </div>
        
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
            <Table query={query} currentPage={currentPage} />
        </Suspense>

        <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={totalPages} />
        </div>
    </div>
    );
}

/**
 * Adding Search and Pagination.
 * 
 * Notes about above code
 * 1. <Search /> allows user to search for specific invocies. <- Look at the UI component for details
 * 2. <Pagination /> allows users to navigate between pages of invoices
 * 3. <Table /> displays the invoices
 * 
 * URL Search Params ... manage the search state.
 * - Benefits
 * 1. Bookmarkable and Shareable URL: All search parameters are in the URL ... save the current state of the application
 * 2. Server-side Rendering and Initial Load: Directly cosumed on the server to render the initial state, making it seaseir to handle server rendering.
 * 3. Analytics and Tracking: Easier to track user behaviour without requiring additional client-side logic.
 * 
 * 
 * Adding Search functionality.
 * 1. Capture the user's input
 * 2. Update the URL with the search params
 * 3. Keep the URL in sync with the input field
 * 4. Update the table to reflect the search query
 * 
 * useSearchParams() hook vs. searchParams prop
 * 1. <Search /> is a CLIENT COMPONENT, use the useSearchParam() hook to access the params from the client.
 * 2. <Tabe /> is a SERVER COMPONENT, use the serachParam prop from the page.tsx to the component.
 */
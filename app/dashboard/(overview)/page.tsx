import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import CardWrapper from "@/app/ui/dashboard/cards";
import { lusitana } from "@/app/ui/fonts";
import { fetchCardData } from "@/app/lib/data";
import { Suspense } from "react";
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardSkeleton } from "@/app/ui/skeletons";
import { Metadata } from 'next';
 
// Metadata of child will override the parent metadata - this allows custom metadata for each page!
export const metadata: Metadata = {
  title: 'Dashboard',    // because of the title template in the layout.tsx, the Metatitle of this page will be "Invoices | Acme Dashboard"
};

export default async function Page() {
    const {
        totalPaidInvoices,
        totalPendingInvoices,
        numberOfInvoices,
        numberOfCustomers
    } = await fetchCardData();

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart  />
                </Suspense>
                
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main>
    );
}

/**
 * Notes about this page
 * - Page is an "async" component. This allows to use "await" to fetch data.
 * - There are also 3 components which receives data: <Card>, <RevenueChar>, and <LatestInvoices>
 * 
 * Revenue fetching processing.
 * 1. fetchRevenue is the result for querying the database.
 * 2. Feed the DB query result into the <RevenueChar> component as prop.
 * 
 * Lastest Invoices fetching.
 * 1. Fetching the last 5 invoices, sorted by date.
 * 
 * 
 * Fetching all data ... couple notes
 * 1. The data requests are unintentionally blocking each other, creating a "request waterfall"
 * - A "waterfall" refers to a sequence of network requests that depen on the completion of previous requests.
 * - In the case of data fetching, each request can only begin once the previous request has returned data.
 * - For example, fetchRevenue() must complete before fetchLatestInvoices() can start running.
 * - This pattern is not bad, but does impact performance.
 * - Case where "waterfall" is desired: Fetch user's ID and profile information first, then fetch friend list using the ID.
 * 
 * - The other option is "Parallel data fetching".
 * - Common way to avoid waterfalls is to initiate all data requests at the same time by using Promise.all() or Promise.allSettles()
 * 
 * 2. Static Rendering vs. Dynamic Rendering
 * - Static Rendering does all data fetching and rendering on the server at build time (when deployed).
 * - Faster Websites and Reducing Server load.
 * - Optimal with page that has NO data or data that does not get updated frequently (static).
 * 
 * - Dynamic Rendering renders content at request time, when user VISITS the page.
 * - Real-time data, User-specific content, and Request time information (cookies or URL search params)
 */
/**
 * Streaming.
 * - Data transfer technique that breaks down a route into smaller "chunks", and progressively stream them from the server as they become ready.
 * - By streaming, it is possible to prevent slow data request from blocking the entire page.
 * - Streaming works well with React's component modal, as each component can be considered a "chunk"
 * - 2 ways to implement Streaming in Next.js: loading.tsx OR <Suspense>
 */
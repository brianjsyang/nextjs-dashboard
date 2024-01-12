import DashboardSkeleton from "@/app/ui/skeletons";

export default function Loading() {
    return <DashboardSkeleton />;
}

/**
 * Streaming the whole page with loading.tsx
 * - Entire page (except for the sidebar) is "loading..." while waiting for the slow connection.
 * 
 * 1. loading.tsx is a special Next.js file (like page.tsx or layout.tsx) built on top of Suspense. It can create fallback UI to show as a replacement while loading.
 * 2. Since <SideNav> is static, it's shown immediately. The user can interact with the <SideNav> while dynamic content is loading.
 * 
 * Issue!
 * - Right now, the loading skeleton applies to the invoices and customers page as well.
 * - Since loading.tsx is a level higher than /invoices/page.tsx, and /customers/page.tsx in the file system, it's also applied to those pages.
 * - We can change this with "Route Groups". (using overview folder).
 * - Route Groups allows organization of files into logical groups without affecting the URL path structure... creating a folder using parenthesis ().
 * - /dashboard/(overview)/page.tsx simply becomes /dashboard.
 */
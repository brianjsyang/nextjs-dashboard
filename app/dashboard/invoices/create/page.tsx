import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function Page() {
    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs 
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    { label: 'Create Invoices', href: '/dashboard/invoices/create', active: true }
                ]}
            />
            <Form customers={customers} />
        </main>
    )
}

/**
 * Creating an Invoice
 * 1. Create a form to capture the user's input
 * 2. Create a Server Action and invoke it from the form
 * 3. Inside the Server Action, extract data from the "formData" object
 * 4. Validate and prepare the data to be inserted into your database
 * 5. insert the data and handle any errors
 * 6. Revalidate the cache and redirect the user back to invoices page
 */
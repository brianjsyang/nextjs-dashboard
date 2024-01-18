import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchInvoiceById ,fetchCustomers } from "@/app/lib/data";
import { notFound } from "next/navigation";


export default async function Page({ params }: { params: { id: string }}) { 
    // allow the <Page> component to accept params prop
    const id = params.id;

    // get the invoice data with prop ID, also get all customers.
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ])

    if (!invoice) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs 
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    { label: 'Edit Invoice', href: `/dashboard/invoices/${id}/edit`, active: true }
                ]}
            />
            <Form invoice={invoice} customers={customers}/>
        </main>
    )
}
/**
 * Dynamic Route Segment!
 * 1. Don't know the exact segment name and want to create routes based on data.
 */
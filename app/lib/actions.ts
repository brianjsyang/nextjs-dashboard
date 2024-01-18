'use server'; // Mark all the exported functions within the file as SERVER FUNCTIONS.

import { z } from "zod"; // TypeScript-first validation library
import { sql } from "@vercel/postgres"; // SQL query to insert to DB.
import { revalidatePath } from "next/cache"; // clear cache
import { redirect } from "next/navigation";

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),  // Amount is set to coerce(change) from a string to a number, while also validating its type.
    status: z.enum(['pending', 'paid']),
    date: z.string()
});

const CreateInvoice = FormSchema.omit({ id: true, date: true});
const UpdateInvoice = FormSchema.omit({ id: true, date: true});

/**
 * Create invoice and insert to database
 * @param formData  Data object that holds user input data from the form ... also validated by Zod.
 * @returns On submition, return user to invoice list.
 */
export async function createInvoice(formData: FormData) {
    // pass rawFormData to CreateInvoice to validate the types.
    const { customerId, amount, status } = CreateInvoice.parse({
        // Extract the values of formData using get() ... other method when there are many entries, const rawFormData = Object.fromEntries(formData.entries())
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // Some clean up for the data.
    const amountInCents = amount * 100; // Usually good practice to store monetary values in cents to eliminate JavaScript floating-point errors and greater accuracy.
    const date = new Date().toISOString().split('T')[0];    // YYYY-MM-DD

    try {
        await sql `
            INSERT INTO invoices (customerId, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        }
    }
    
    // Since the data displayed will be updated, cache must be cleared to trigger new request to the server.
    revalidatePath('/dashboard/invocies');

    // redirect user back to the list of all invoices.
    redirect('/dashboard/invoices');
}


/**
 * Edit existing invoice
 * @param id        UUID of the invoice to edit.
 * @param formData  Data object that holds user input data from the form ... also validated by Zod.
 */
export async function updateInvoice(id: string, formData: FormData) {
    // pass rawFormData to UpdateInvoice to validate the types.
    const { customerId, amount, status } = UpdateInvoice.parse({
        // Extract the values of formData using get() ... other method when there are many entries, const rawFormData = Object.fromEntries(formData.entries())
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    try {
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        return { message: `Database Error: Failed to Update Invoice with UUID: ${id}, CustomerID: ${customerId}`}
    }
 
    /**
     * Note how redirect is being called outside the try/catch block.
     * - Redirect works by throwing an error, which would be caught by the catch block.
     * - To avoid that, call redirect AFTER try/catch block.
     * - Redirect is only reachable if try is successful.
     */
    revalidatePath('/dashboard/invocies');
    redirect('/dashboard/invoices');
}



export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice...test')

    try {
        await sql`
            DELETE FROM invoices WHERE id = ${id}
        `;
        revalidatePath('/dashboard/invocies');
    } catch (error) {
        return { message: `Database Error: Failed to Delete Invoice with UUID: ${id}`}
    }
}
'use server'; // Mark all the exported functions within the file as SERVER FUNCTIONS.

import { z } from "zod"; // TypeScript-first validation library
import { sql } from "@vercel/postgres"; // SQL query to insert to DB.
import { revalidatePath } from "next/cache"; // clear cache
import { redirect } from "next/navigation";

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({ invalid_type_error: 'Please select a customer.'}),
    amount: z.coerce
        .number()  // Amount is set to coerce(change) from a string to a number, while also validating its type.
        .gt(0, { message: 'Please enter an amout greater than $0.' }), // gt ... greater than
    status: z.enum(['pending', 'paid'], { invalid_type_error: 'Pleae select an invoice status' }),
    date: z.string()
});

const CreateInvoice = FormSchema.omit({ id: true, date: true});
const UpdateInvoice = FormSchema.omit({ id: true, date: true});


// This is temporary until @types/react-dom is updated
export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
};

/**
 * Create invoice and insert to database
 * @param prevState Contains the state passed from the useFormState hook (from create-form.tsx).
 * @param formData  Data object that holds user input data from the form ... also validated by Zod.
 * @returns On submition, return user to invoice list.
 */
export async function createInvoice(prevState: State ,formData: FormData) {

    const validatedFields = CreateInvoice.safeParse({
        // safeParse() returns an object containing either "success" or "error". Help validate more gracefully.
        customerId: formData.get('customerId'),  // Extract the values of formData using get() ... other method when there are many entries, const rawFormData = Object.fromEntries(formData.entries())
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Some clean up for the data.
    const { customerId, amount, status } = validatedFields.data;
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
 * @param prevState Contains the state passed from the useFormState hook (from create-form.tsx).
 * @param formData  Data object that holds user input data from the form ... also validated by Zod.
 */
export async function updateInvoice(id: string, prevState: State, formData: FormData) {

    const validatedFields = UpdateInvoice.safeParse({
        // safeParse() returns an object containing either "success" or "error". Help validate more gracefully.
        customerId: formData.get('customerId'),  // Extract the values of formData using get() ... other method when there are many entries, const rawFormData = Object.fromEntries(formData.entries())
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
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
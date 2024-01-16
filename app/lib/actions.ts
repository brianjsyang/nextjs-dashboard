'use server'; // Mark all the exported functions within the file as SERVER FUNCTIONS.

// create a new async function taht accepts "formData".
export async function createInvoice(formData: FormData) {

    // Extract the values of formData using get() ... other method when there are many entries, const rawFormData = Object.fromEntries(formData.entries())
    const rawFormData = {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    }

    // Test it out
    console.log(rawFormData);

    // continue from Step 4...
}
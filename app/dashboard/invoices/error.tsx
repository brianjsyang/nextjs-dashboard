'use client'

import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error & { digest?: string}; reset: () => void}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service.
        console.log(error);
    }, [error])

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <h2 className="text-center">Something went wrong!</h2>
            <button
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                onClick={
                    // Attempt to recover by trying to re-render the invoices route
                    () => reset()
                }
            >
            Try again
            </button>
        </main>
  );
}

/**
 * error.tsx is used to define a UI boundary for a route segment.
 * It serves as a "catch-all" for unexpected errors,
 * Allows a fallback UI to user.
 * 
 * Notes:
 * 1. "use client": error.tsx needs to be a Client Component.
 * 2. Accepts 2 props:
 * 2-1: "error": This object is an instace of JavaScript's native Error object.
 * 2-2: "reset": Function to reset the error boundary. When executed, the function will try to re-render the route segment.
 */
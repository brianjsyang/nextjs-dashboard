'use client'; // this is a Client Component, you can use event listners and hooks!

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; // prevent firing search query on every key-stroke ... force a timeout

export default function Search({ placeholder }: { placeholder: string }) {
  const serachParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter(); // ... using the "replace" function from useRouter()


  /**
   * How debounce works:
   * 1. Trigger Event: When an event that should be debounced (ex: keystroke) occurs, timer starts.
   * 2. Wait: If a new event occurs before the timer expires, the timer is reset
   * 3. Execution: If the timer reaches the end of its countdown, the debounce function is executed.
   */
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(serachParams); // URLSearchParams is a Web API that provides utility methos for manipulating the URL query parameters.
    params.set('page', '1'); // when user starts inputting, reset the page to 1.
    
    // capture uer input!
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    /**
     * 1. ${pathname} is the current path ... in this case "/dashboard/invoices/"
     * 2. params.toString() translates the user input into URL-friendly format.
     * 3. Attach the param to base url. Ex) "/dashboard/invoices?query=lee"
     * 4. The URL updates WITHOUT reloading the page, thanks to Next.js's client-side navigation
     */
    replace(`${pathname}?${[params.toString()]}`);
  }, 300);


  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search_item" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {handleSearch(e.target.value)}}
        defaultValue={serachParams.get('query')?.toString()} // keeping the value of URL params the same as input field.
        aria-label='search_item'
        id='search_item'
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
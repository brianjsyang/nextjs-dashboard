import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({ children } : { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

/**
 * Root Layout is required.
 * Any UI added to the root layout will be shared across *all* pages in the application.
 * Use the root layout to modify the <html> and <body> tags, and add metadata.
 */
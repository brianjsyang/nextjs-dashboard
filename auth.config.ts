import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

/**
 * Chapter 15
 * 
 * authConfig:
 * - contain the configuration options for the NextAuth.js.
 * - For now, only contains the "pages" option. Use the "pages" option to specify the route for custom sign-in, sign-out, and error pages.
 * - Adding "signIn" redirects users to custom login page, rather than the NextAuth.js default.
 * 
 * callbacks - Protect the app's routes with Next.js Middleware
 * - "authorized" callback to verify if the request is authorized to access a page via Next.js Middleware.
 * - Called before a request is completed, receives an object with the "auth" and "request" properties.
 * 
 */
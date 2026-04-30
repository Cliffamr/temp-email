import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isApiAuth = nextUrl.pathname.startsWith('/api/auth');
            const isLogin = nextUrl.pathname.startsWith('/login');

            if (isApiAuth) return true;

            if (isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && isLogin) {
                // If logged in and trying to access login page, redirect to admin
                return Response.redirect(new URL('/admin/dashboard', nextUrl));
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

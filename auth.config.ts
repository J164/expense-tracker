import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    providers: [],
    trustHost: true,
    pages: {
        signIn: "/login"
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            return !nextUrl.pathname.startsWith("/dashboard") || !!auth;
        }
    }
} satisfies NextAuthConfig;

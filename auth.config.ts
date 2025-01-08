import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
    pages: {
        signIn: "/login"
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            return !nextUrl.pathname.startsWith("/dashboard") || !!auth;
        }
    },
    providers: [Google]
} satisfies NextAuthConfig;

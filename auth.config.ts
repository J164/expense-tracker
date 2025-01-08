import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
    pages: {
        signIn: "/login"
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth;
            if (nextUrl.pathname.startsWith("/dashboard")) {
                return isLoggedIn;
            }

            if (isLoggedIn) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            return true;
        }
    },
    providers: [Google]
} satisfies NextAuthConfig;

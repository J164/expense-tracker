import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
    pages: {
        signIn: "/login"
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            return !nextUrl.pathname.startsWith("/dashboard") || !!auth;
        },
        jwt({ token, user }) {
            if (user) {
                // User is available during sign-in
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            session.user.id = token.id as string;
            return session;
        }
    },
    providers: [Google]
} satisfies NextAuthConfig;

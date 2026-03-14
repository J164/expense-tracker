import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import {
    attachSessionUserId,
    handleAuthSignIn,
    hydrateTokenUserId
} from "@/app/lib/server/auth-callbacks";
import { upsertUser } from "@/app/lib/server/repository";
import { authConfig } from "./auth.config";

const isTestAuthEnabled =
    process.env.AUTH_ENABLE_TEST_PROVIDER === "true" ||
    (process.env.NODE_ENV !== "production" &&
        process.env.AUTH_ENABLE_TEST_PROVIDER !== "false");
const isGoogleAuthEnabled =
    Boolean(process.env.AUTH_GOOGLE_ID) &&
    Boolean(process.env.AUTH_GOOGLE_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        ...(isGoogleAuthEnabled ? [Google] : []),
        ...(isTestAuthEnabled
            ? [
                  Credentials({
                      name: "Test Login",
                      credentials: {
                          email: { label: "Email", type: "email" },
                          name: { label: "Name", type: "text" }
                      },
                      async authorize(credentials) {
                          const email = credentials.email?.toString().trim();

                          if (!email) {
                              return null;
                          }

                          const user = await upsertUser({
                              email,
                              name:
                                  credentials.name?.toString().trim() ||
                                  "Test User"
                          });

                          return {
                              id: user.id,
                              email: user.email,
                              name: user.name,
                              image: user.image
                          };
                      }
                  })
              ]
            : [])
    ],
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account }) {
            return handleAuthSignIn({
                user,
                providerAccountId: account?.providerAccountId ?? null
            });
        },
        async jwt({ token, user }) {
            return hydrateTokenUserId(token, user);
        },
        session({ session, token }) {
            return attachSessionUserId(session, token);
        }
    },
    session: { strategy: "jwt" }
});

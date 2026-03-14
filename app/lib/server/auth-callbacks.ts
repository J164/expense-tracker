import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { getUserByEmail, upsertUser } from "./repository";

export async function handleAuthSignIn(input: {
    user: User;
    providerAccountId?: string | null;
}) {
    if (!input.user.email) {
        return false;
    }

    try {
        const persistedUser = await upsertUser({
            email: input.user.email,
            name: input.user.name,
            image: input.user.image,
            providerAccountId: input.providerAccountId ?? null
        });

        input.user.id = persistedUser.id;
        return true;
    } catch (error) {
        console.error("[auth] Failed to persist signed-in user", {
            email: input.user.email,
            providerAccountId: input.providerAccountId ?? null,
            error
        });

        const existingUser = await getUserByEmail(input.user.email);
        if (existingUser) {
            input.user.id = existingUser.id;
            return true;
        }

        throw error;
    }
}

export async function hydrateTokenUserId(token: JWT, user?: User) {
    try {
        if (user?.id) {
            token.id = user.id;
            return token;
        }

        if (token.email && !token.id) {
            const existingUser = await getUserByEmail(token.email);
            if (existingUser) {
                token.id = existingUser.id;
            }
        }

        return token;
    } catch (error) {
        console.error("[auth] Failed to hydrate token user id", {
            email: token.email,
            error
        });

        return token;
    }
}

export function attachSessionUserId(session: Session, token: JWT) {
    if (session.user && token.id) {
        session.user.id = token.id;
    }

    return session;
}

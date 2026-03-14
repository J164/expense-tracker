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

    const persistedUser = await upsertUser({
        email: input.user.email,
        name: input.user.name,
        image: input.user.image,
        providerAccountId: input.providerAccountId ?? null
    });

    input.user.id = persistedUser.id;
    return true;
}

export async function hydrateTokenUserId(token: JWT, user?: User) {
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
}

export function attachSessionUserId(session: Session, token: JWT) {
    if (session.user && token.id) {
        session.user.id = token.id;
    }

    return session;
}

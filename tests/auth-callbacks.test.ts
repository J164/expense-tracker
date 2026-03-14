import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import {
    attachSessionUserId,
    handleAuthSignIn,
    hydrateTokenUserId
} from "@/app/lib/server/auth-callbacks";
import * as repository from "@/app/lib/server/repository";

describe("auth callbacks", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("rejects sign-in when the provider does not return an email", async () => {
        await expect(
            handleAuthSignIn({
                user: { id: "", name: null, email: null, image: null } as User
            })
        ).resolves.toBe(false);
    });

    it("persists users and hydrates tokens", async () => {
        vi.spyOn(repository, "upsertUser").mockResolvedValue({
            id: "user-1",
            email: "demo@example.com",
            name: "Demo",
            image: null,
            providerAccountId: "google-1",
            monthlyBudgetCents: 0,
            createdAt: "2026-03-14T00:00:00.000Z",
            updatedAt: "2026-03-14T00:00:00.000Z"
        });
        vi.spyOn(repository, "getUserByEmail").mockResolvedValue({
            id: "user-1",
            email: "demo@example.com",
            name: "Demo",
            image: null,
            providerAccountId: "google-1",
            monthlyBudgetCents: 0,
            createdAt: "2026-03-14T00:00:00.000Z",
            updatedAt: "2026-03-14T00:00:00.000Z"
        });

        const user = {
            id: "",
            email: "demo@example.com",
            name: "Demo",
            image: null
        } as User;

        await expect(
            handleAuthSignIn({ user, providerAccountId: "google-1" })
        ).resolves.toBe(true);
        expect(user.id).toBe("user-1");

        const tokenWithUser = (await hydrateTokenUserId(
            { email: "demo@example.com" } as JWT,
            { id: "user-1" } as User
        )) as JWT;
        expect(tokenWithUser.id).toBe("user-1");

        const tokenFromEmail = (await hydrateTokenUserId({
            email: "demo@example.com"
        } as JWT)) as JWT;
        expect(tokenFromEmail.id).toBe("user-1");
    });

    it("leaves tokens and sessions unchanged when no user id can be resolved", async () => {
        vi.spyOn(repository, "getUserByEmail").mockResolvedValue(null);
        vi.spyOn(repository, "upsertUser").mockResolvedValue({
            id: "user-2",
            email: "demo@example.com",
            name: "Demo",
            image: null,
            providerAccountId: null,
            monthlyBudgetCents: 0,
            createdAt: "2026-03-14T00:00:00.000Z",
            updatedAt: "2026-03-14T00:00:00.000Z"
        });

        const user = {
            id: "",
            email: "demo@example.com",
            name: "Demo",
            image: null
        } as User;
        await expect(handleAuthSignIn({ user })).resolves.toBe(true);

        const token = await hydrateTokenUserId({} as JWT);
        expect(token.id).toBeUndefined();

        const session = attachSessionUserId(
            { user: { id: "", email: "demo@example.com" } } as Session,
            {} as JWT
        );
        expect(session.user.id).toBe("");
    });

    it("falls back to an existing user when persisting sign-in fails", async () => {
        const error = new Error("write failed");
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => undefined);

        vi.spyOn(repository, "upsertUser").mockRejectedValue(error);
        vi.spyOn(repository, "getUserByEmail").mockResolvedValue({
            id: "user-3",
            email: "demo@example.com",
            name: "Demo",
            image: null,
            providerAccountId: "google-1",
            monthlyBudgetCents: 0,
            createdAt: "2026-03-14T00:00:00.000Z",
            updatedAt: "2026-03-14T00:00:00.000Z"
        });

        const user = {
            id: "",
            email: "demo@example.com",
            name: "Demo",
            image: null
        } as User;

        await expect(handleAuthSignIn({ user })).resolves.toBe(true);
        expect(user.id).toBe("user-3");
        expect(consoleError).toHaveBeenCalled();
    });

    it("rethrows sign-in persistence errors when no fallback user exists", async () => {
        const error = new Error("write failed");
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        vi.spyOn(repository, "upsertUser").mockRejectedValue(error);
        vi.spyOn(repository, "getUserByEmail").mockResolvedValue(null);

        await expect(
            handleAuthSignIn({
                user: {
                    id: "",
                    email: "demo@example.com",
                    name: "Demo",
                    image: null
                } as User
            })
        ).rejects.toThrow("write failed");
    });

    it("returns the token unchanged when token hydration lookup fails", async () => {
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        vi.spyOn(repository, "getUserByEmail").mockRejectedValue(
            new Error("lookup failed")
        );

        const token = await hydrateTokenUserId({
            email: "demo@example.com"
        } as JWT);

        expect(token.id).toBeUndefined();
    });

    it("attaches the database user id to the session", () => {
        const session = attachSessionUserId(
            { user: { id: "", email: "demo@example.com" } } as Session,
            { id: "user-99" } as JWT
        );

        expect(session.user.id).toBe("user-99");
    });
});

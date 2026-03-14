import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./app/lib/server/schema.ts",
    out: "./drizzle",
    dialect: "sqlite",
    dbCredentials: {
        url: process.env.LOCAL_DB_PATH ?? "./.wrangler/state/expense-tracker.db"
    }
});

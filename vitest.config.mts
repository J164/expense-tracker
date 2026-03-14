import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        include: ["tests/**/*.test.ts"],
        exclude: ["tests/e2e/**", "node_modules/**"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov"],
            include: [
                "app/lib/constants.ts",
                "app/lib/currency.ts",
                "app/lib/dates.ts",
                "app/lib/utils.ts",
                "app/lib/server/auth-callbacks.ts",
                "app/lib/server/recurring.ts",
                "app/lib/server/repository.ts"
            ],
            exclude: ["app/lib/server/sql.ts"],
            thresholds: {
                lines: 100,
                branches: 100,
                functions: 100,
                statements: 100
            }
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, ".")
        }
    }
});

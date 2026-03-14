import type {
    D1Database,
    D1PreparedStatement
} from "@cloudflare/workers-types";
import type DatabaseType from "better-sqlite3";

type SqlValue = string | number | null;

type RunResult = {
    changes: number;
    lastInsertRowid: number | bigint | null;
};

export interface SqlExecutor {
    all<T>(query: string, params?: SqlValue[]): Promise<T[]>;
    first<T>(query: string, params?: SqlValue[]): Promise<T | null>;
    run(query: string, params?: SqlValue[]): Promise<RunResult>;
    batch(
        statements: Array<{ query: string; params?: SqlValue[] }>
    ): Promise<void>;
}

declare global {
    var __expenseTrackerLocalDb__: DatabaseType.Database | undefined;
}

async function getLocalDatabase() {
    if (!global.__expenseTrackerLocalDb__) {
        const [{ default: Database }, fs, path] = await Promise.all([
            import("better-sqlite3"),
            import("node:fs"),
            import("node:path")
        ]);
        const dbPath =
            process.env.LOCAL_DB_PATH ??
            path.join(
                process.cwd(),
                ".wrangler",
                "state",
                "expense-tracker.db"
            );
        const migrationSql = fs.readFileSync(
            path.join(process.cwd(), "drizzle", "0000_initial.sql"),
            "utf8"
        );

        fs.mkdirSync(path.dirname(dbPath), { recursive: true });
        const db = new Database(dbPath);
        db.pragma("foreign_keys = ON");
        db.exec(migrationSql);
        global.__expenseTrackerLocalDb__ = db;
    }

    return global.__expenseTrackerLocalDb__;
}

class BetterSqliteExecutor implements SqlExecutor {
    constructor(private readonly database: DatabaseType.Database) {}

    async all<T>(query: string, params: SqlValue[] = []) {
        return this.database.prepare(query).all(...params) as T[];
    }

    async first<T>(query: string, params: SqlValue[] = []) {
        return (
            (this.database.prepare(query).get(...params) as T | undefined) ??
            null
        );
    }

    async run(query: string, params: SqlValue[] = []) {
        const result = this.database.prepare(query).run(...params);
        return {
            changes: result.changes,
            lastInsertRowid: result.lastInsertRowid
        };
    }

    async batch(statements: Array<{ query: string; params?: SqlValue[] }>) {
        const transaction = this.database.transaction(() => {
            for (const statement of statements) {
                this.database
                    .prepare(statement.query)
                    .run(...(statement.params ?? []));
            }
        });

        transaction();
    }
}

class D1Executor implements SqlExecutor {
    constructor(private readonly database: D1Database) {}

    private prepare(
        query: string,
        params: SqlValue[] = []
    ): D1PreparedStatement {
        return this.database.prepare(query).bind(...params);
    }

    async all<T>(query: string, params: SqlValue[] = []) {
        const result = await this.prepare(query, params).all<T>();
        return result.results ?? [];
    }

    async first<T>(query: string, params: SqlValue[] = []) {
        return (await this.prepare(query, params).first<T>()) ?? null;
    }

    async run(query: string, params: SqlValue[] = []) {
        const result = await this.prepare(query, params).run();
        return {
            changes: result.meta.changes ?? 0,
            lastInsertRowid: result.meta.last_row_id ?? null
        };
    }

    async batch(statements: Array<{ query: string; params?: SqlValue[] }>) {
        await this.database.batch(
            statements.map(statement =>
                this.database
                    .prepare(statement.query)
                    .bind(...(statement.params ?? []))
            )
        );
    }
}

async function getCloudflareBinding() {
    if (process.env.LOCAL_DB_PATH || process.env.NODE_ENV !== "production") {
        return null;
    }

    try {
        const { getCloudflareContext } = await import("@opennextjs/cloudflare");
        const context = await getCloudflareContext({ async: true });
        return (context.env as { DB?: D1Database } | undefined)?.DB ?? null;
    } catch {
        return null;
    }
}

export async function getSqlExecutor(): Promise<SqlExecutor> {
    const d1Database = await getCloudflareBinding();

    if (d1Database) {
        return new D1Executor(d1Database);
    }

    return new BetterSqliteExecutor(await getLocalDatabase());
}

export async function resetLocalDatabaseForTesting() {
    if (!global.__expenseTrackerLocalDb__) {
        return;
    }

    global.__expenseTrackerLocalDb__.close();
    global.__expenseTrackerLocalDb__ = undefined;
}

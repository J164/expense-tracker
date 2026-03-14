CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    image TEXT,
    provider_account_id TEXT UNIQUE,
    monthly_budget_cents INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recurring_transactions (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    category TEXT,
    frequency TEXT NOT NULL CHECK (frequency IN ('MONTHLY', 'YEARLY')),
    start_date TEXT NOT NULL,
    end_date TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_generated TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    category TEXT,
    purchase_date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    recurring_transaction_id TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recurring_transaction_id) REFERENCES recurring_transactions(id) ON DELETE SET NULL,
    UNIQUE (recurring_transaction_id, purchase_date)
);

CREATE TABLE IF NOT EXISTS user_tags (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_purchase_date
    ON transactions (user_id, purchase_date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_category
    ON transactions (user_id, category);
CREATE INDEX IF NOT EXISTS idx_transactions_user_name
    ON transactions (user_id, name);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_user_active
    ON recurring_transactions (user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_user_frequency
    ON recurring_transactions (user_id, frequency);
CREATE INDEX IF NOT EXISTS idx_user_tags_user
    ON user_tags (user_id);

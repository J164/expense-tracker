-- CreateTable
CREATE TABLE "monthly_summary" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "month" DATE NOT NULL,
    "total_spent" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "budget" DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "monthly_summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "category" VARCHAR(255),
    "purchase_date" DATE NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "default_budget" DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monthly_summary_user_id_month_key" ON "monthly_summary"("user_id", "month");

-- CreateIndex
CREATE INDEX "transactions_user_id_purchase_date_idx" ON "transactions"("user_id", "purchase_date");

-- CreateIndex
CREATE INDEX "transactions_user_id_category_idx" ON "transactions"("user_id", "category");

-- CreateIndex
CREATE INDEX "transactions_user_id_name_idx" ON "transactions"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "monthly_summary" ADD CONSTRAINT "monthly_summary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

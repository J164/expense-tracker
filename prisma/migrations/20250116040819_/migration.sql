/*
  Warnings:

  - The primary key for the `MonthlySummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "MonthlySummary" DROP CONSTRAINT "MonthlySummary_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MonthlySummary_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MonthlySummary_id_seq";

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Transaction_id_seq";

-- RenameForeignKey
ALTER TABLE "Transaction" RENAME CONSTRAINT "purchases_user_id_fkey" TO "Transaction_user_id_fkey";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_monthly_summary()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO "MonthlySummary" (id, user_id, month, total_spent, budget)
        VALUES (
            uuid_generate_v4(),
            NEW.user_id, 
            DATE_TRUNC('month', NEW.purchase_date), 
            NEW.amount, 
            (SELECT default_budget FROM "User" WHERE id = NEW.user_id)
        )
        ON CONFLICT (user_id, month) DO UPDATE 
        SET total_spent = "MonthlySummary".total_spent + NEW.amount;
    END IF;
    
    IF TG_OP = 'UPDATE' THEN
        UPDATE "MonthlySummary"
        SET 
            total_spent = total_spent + NEW.amount - OLD.amount
        WHERE user_id = NEW.user_id
          AND DATE_TRUNC('month', month) = DATE_TRUNC('month', NEW.purchase_date);
    END IF;

    IF TG_OP = 'DELETE' THEN
        UPDATE "MonthlySummary"
        SET 
            total_spent = total_spent - OLD.amount
        WHERE user_id = OLD.user_id
          AND DATE_TRUNC('month', month) = DATE_TRUNC('month', OLD.purchase_date);
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_monthly_summary
AFTER INSERT OR UPDATE OR DELETE ON "Transaction"
FOR EACH ROW
EXECUTE FUNCTION update_monthly_summary();
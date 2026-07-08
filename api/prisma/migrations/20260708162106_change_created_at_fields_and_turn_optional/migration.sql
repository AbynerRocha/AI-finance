/*
  Warnings:

  - You are about to drop the column `date` on the `tb_transactions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "tb_transactions_finance_user_id_date_idx";

-- AlterTable
ALTER TABLE "tb_accounts" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "tb_transactions" DROP COLUMN "date",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "tb_users" ALTER COLUMN "created_at" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "tb_transactions_finance_user_id_created_at_idx" ON "tb_transactions"("finance_user_id", "created_at");

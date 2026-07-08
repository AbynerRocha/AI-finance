-- CreateEnum
CREATE TYPE "TransactionTypes" AS ENUM ('BILL', 'SALARY', 'OTHER');

-- CreateEnum
CREATE TYPE "AccountTypes" AS ENUM ('MAIN', 'SAVINGS', 'INVESTING', 'OTHER');

-- CreateTable
CREATE TABLE "tb_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "tb_transactions" (
    "id" TEXT NOT NULL,
    "finance_user_id" TEXT NOT NULL,
    "type" "TransactionTypes" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "tb_accounts" (
    "id" TEXT NOT NULL,
    "account_user_id" TEXT NOT NULL,
    "type" "AccountTypes" NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'DOL',
    "amountCent" BIGINT NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_id_key" ON "tb_users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_email_key" ON "tb_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_transactions_id_key" ON "tb_transactions"("id");

-- CreateIndex
CREATE INDEX "tb_transactions_finance_user_id_date_idx" ON "tb_transactions"("finance_user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "tb_accounts_id_key" ON "tb_accounts"("id");

-- CreateIndex
CREATE INDEX "tb_accounts_account_user_id_idx" ON "tb_accounts"("account_user_id");

-- AddForeignKey
ALTER TABLE "tb_transactions" ADD CONSTRAINT "tb_transactions_finance_user_id_fkey" FOREIGN KEY ("finance_user_id") REFERENCES "tb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_accounts" ADD CONSTRAINT "tb_accounts_account_user_id_fkey" FOREIGN KEY ("account_user_id") REFERENCES "tb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

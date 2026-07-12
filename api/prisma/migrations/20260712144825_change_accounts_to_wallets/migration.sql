/*
  Warnings:

  - You are about to drop the `tb_accounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('MAIN', 'SAVINGS', 'INVESTING', 'OTHER');

-- DropForeignKey
ALTER TABLE "tb_accounts" DROP CONSTRAINT "tb_accounts_account_user_id_fkey";

-- AlterTable
ALTER TABLE "tb_transactions" ADD COLUMN     "walletId" TEXT;

-- DropTable
DROP TABLE "tb_accounts";

-- DropEnum
DROP TYPE "AccountTypes";

-- CreateTable
CREATE TABLE "tb_wallets" (
    "id" TEXT NOT NULL,
    "account_user_id" TEXT NOT NULL,
    "type" "WalletType" NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'DOL',
    "amountCent" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_wallets_id_key" ON "tb_wallets"("id");

-- CreateIndex
CREATE INDEX "tb_wallets_account_user_id_idx" ON "tb_wallets"("account_user_id");

-- AddForeignKey
ALTER TABLE "tb_transactions" ADD CONSTRAINT "tb_transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "tb_wallets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_wallets" ADD CONSTRAINT "tb_wallets_account_user_id_fkey" FOREIGN KEY ("account_user_id") REFERENCES "tb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

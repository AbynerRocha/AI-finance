/*
  Warnings:

  - Made the column `created_at` on table `tb_transactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `tb_wallets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tb_transactions" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "tb_wallets" ALTER COLUMN "created_at" SET NOT NULL;

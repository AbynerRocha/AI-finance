/*
  Warnings:

  - Added the required column `name` to the `tb_wallets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_refresh_tokens" ALTER COLUMN "revoked_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tb_wallets" ADD COLUMN     "name" TEXT NOT NULL;

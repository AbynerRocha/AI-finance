-- DropIndex
DROP INDEX "tb_refresh_tokens_user_id_idx";

-- DropIndex
DROP INDEX "tb_wallets_account_user_id_idx";

-- CreateIndex
CREATE INDEX "tb_refresh_tokens_token_user_id_idx" ON "tb_refresh_tokens"("token", "user_id");

-- CreateIndex
CREATE INDEX "tb_users_id_idx" ON "tb_users"("id");

-- CreateIndex
CREATE INDEX "tb_wallets_id_account_user_id_idx" ON "tb_wallets"("id", "account_user_id");

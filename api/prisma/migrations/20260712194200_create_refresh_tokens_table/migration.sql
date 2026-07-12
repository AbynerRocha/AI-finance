-- CreateTable
CREATE TABLE "tb_refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_refresh_tokens_token_key" ON "tb_refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "tb_refresh_tokens_user_id_idx" ON "tb_refresh_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "tb_refresh_tokens" ADD CONSTRAINT "tb_refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

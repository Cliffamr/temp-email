/*
  Warnings:

  - You are about to rename the column `expiresAt` on the `Inbox` table to `publicExpiresAt`.

*/
-- DropIndex
DROP INDEX "Inbox_expiresAt_idx";

-- AlterTable
ALTER TABLE "Inbox" RENAME COLUMN "expiresAt" TO "publicExpiresAt";

-- CreateIndex
CREATE INDEX "Inbox_publicExpiresAt_idx" ON "Inbox"("publicExpiresAt");

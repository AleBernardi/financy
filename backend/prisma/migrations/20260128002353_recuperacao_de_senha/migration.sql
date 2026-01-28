-- AlterTable
ALTER TABLE "users" ADD COLUMN "passwordRecoveryCode" INTEGER;
ALTER TABLE "users" ADD COLUMN "passwordRecoveryExpiresAt" DATETIME;

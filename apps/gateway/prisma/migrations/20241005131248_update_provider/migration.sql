/*
  Warnings:

  - You are about to drop the column `email` on the `Providers` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Providers_email_key";

-- AlterTable
ALTER TABLE "Providers" DROP COLUMN "email";

/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Providers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Providers" ADD COLUMN     "email" VARCHAR(500) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Providers_email_key" ON "Providers"("email");

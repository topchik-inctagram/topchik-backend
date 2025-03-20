/*
  Warnings:

  - You are about to alter the column `nickname` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `email` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `hash` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - Made the column `hash` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "nickname" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "hash" SET NOT NULL,
ALTER COLUMN "hash" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMPTZ;

/*
  Warnings:

  - You are about to drop the `Avatars` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Avatars" DROP CONSTRAINT "Avatars_profileId_fkey";

-- AlterTable
ALTER TABLE "Profiles" ADD COLUMN     "avatarId" TEXT;

-- DropTable
DROP TABLE "Avatars";

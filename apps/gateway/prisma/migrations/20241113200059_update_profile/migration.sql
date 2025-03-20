/*
  Warnings:

  - You are about to drop the column `city` on the `Profiles` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profiles" DROP COLUMN "city",
DROP COLUMN "country",
ADD COLUMN     "cityId" INTEGER;

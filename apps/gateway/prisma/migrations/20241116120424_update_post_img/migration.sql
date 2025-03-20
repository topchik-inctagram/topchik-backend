-- AlterTable
ALTER TABLE "PostImages" ADD COLUMN     "mediumUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "originUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "smallUrl" TEXT NOT NULL DEFAULT '';

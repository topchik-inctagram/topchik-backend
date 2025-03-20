/*
  Warnings:

  - You are about to drop the `Confirmation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Confirmation" DROP CONSTRAINT "Confirmation_userId_fkey";

-- DropTable
DROP TABLE "Confirmation";

-- CreateTable
CREATE TABLE "Confirmations" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "code" UUID NOT NULL,
    "exp" TIMESTAMPTZ NOT NULL,
    "status" "ConfirmationStatus" NOT NULL DEFAULT 'NOT_CONFIRM',

    CONSTRAINT "Confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Confirmations_userId_key" ON "Confirmations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Confirmations_code_key" ON "Confirmations"("code");

-- AddForeignKey
ALTER TABLE "Confirmations" ADD CONSTRAINT "Confirmations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

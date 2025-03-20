-- CreateEnum
CREATE TYPE "ConfirmationStatus" AS ENUM ('CONFIRM', 'NOT_CONFIRM');

-- CreateTable
CREATE TABLE "Confirmation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "code" UUID NOT NULL,
    "exp" TIMESTAMPTZ NOT NULL,
    "status" "ConfirmationStatus" NOT NULL DEFAULT 'NOT_CONFIRM',

    CONSTRAINT "Confirmation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Confirmation_userId_key" ON "Confirmation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Confirmation_code_key" ON "Confirmation"("code");

-- AddForeignKey
ALTER TABLE "Confirmation" ADD CONSTRAINT "Confirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

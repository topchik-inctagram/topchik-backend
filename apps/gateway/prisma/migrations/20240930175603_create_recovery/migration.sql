-- CreateEnum
CREATE TYPE "RecoveryStatus" AS ENUM ('DONE', 'IN_PROGRESS');

-- CreateTable
CREATE TABLE "Recoveries" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "code" UUID NOT NULL,
    "exp" TIMESTAMPTZ NOT NULL,
    "status" "RecoveryStatus" NOT NULL DEFAULT 'DONE',

    CONSTRAINT "Recoveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recoveries_userId_key" ON "Recoveries"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Recoveries_code_key" ON "Recoveries"("code");

-- AddForeignKey
ALTER TABLE "Recoveries" ADD CONSTRAINT "Recoveries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

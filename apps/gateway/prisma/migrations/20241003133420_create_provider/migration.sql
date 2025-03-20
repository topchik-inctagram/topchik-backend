-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('GOOGLE', 'GIT_HUB');

-- CreateTable
CREATE TABLE "Providers" (
    "id" SERIAL NOT NULL,
    "providerId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "type" "ProviderType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Providers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Providers" ADD CONSTRAINT "Providers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

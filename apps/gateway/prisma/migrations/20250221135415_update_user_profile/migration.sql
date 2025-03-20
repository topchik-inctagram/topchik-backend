-- AlterTable
ALTER TABLE "Profiles" ADD COLUMN     "countryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "Cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Devices" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "ip" VARCHAR(200) NOT NULL,
    "exp" INTEGER NOT NULL,
    "iat" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Devices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Devices" ADD CONSTRAINT "Devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

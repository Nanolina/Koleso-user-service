-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "LanguageType" AS ENUM ('English', 'Russian');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "gender" "GenderType",
    "birthDate" DATE,
    "language" "LanguageType" NOT NULL DEFAULT 'English',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "apartment" TEXT,
    "postalCode" TEXT,
    "additionalInfo" TEXT,
    "userId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

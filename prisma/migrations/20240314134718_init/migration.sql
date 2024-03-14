-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('Passport', 'CertificateOfRegistration', 'CertificateOfDirectorsAndSecretary', 'CertificateOfRegisteredOffice', 'CertificateOfShareholders', 'CertificateTaxResidency');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "LanguageType" AS ENUM ('English', 'Russian');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "founderId" TEXT NOT NULL,
    "TIN" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "surname" VARCHAR(255),
    "patronymic" VARCHAR(255),
    "gender" "GenderType",
    "birthDate" DATE,
    "language" "LanguageType" NOT NULL DEFAULT 'English',
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
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
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "user_gender_enum" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "user_language_enum" AS ENUM ('English', 'Russian');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" VARCHAR(255),
    "phoneNumber" VARCHAR(20) NOT NULL,
    "gender" "user_gender_enum",
    "birthDate" DATE,
    "language" "user_language_enum" NOT NULL DEFAULT 'English',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "user"("phoneNumber");

/*
  Warnings:

  - You are about to drop the column `address` on the `ClientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `ClientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `ClientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `MediaFile` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `MediaFile` table. All the data in the column will be lost.
  - You are about to drop the column `uploaderId` on the `MediaFile` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `MediaFile` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `ProviderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `hourlyRate` on the `ProviderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `ProviderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ProviderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hashedPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - Added the required column `agreedPrice` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `ClientProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `MediaFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `MediaFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `MediaFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerUserId` to the `MediaFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose` to the `MediaFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeBytes` to the `MediaFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageKey` to the `MediaFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MediaFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `ProviderProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING_EMAIL_VERIFICATION', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "ProviderLevel" AS ENUM ('LEVEL_0', 'LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4_PRO', 'LEVEL_5_PREMIUM');

-- CreateEnum
CREATE TYPE "ProviderVerificationStatus" AS ENUM ('NOT_STARTED', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_CORRECTION');

-- CreateEnum
CREATE TYPE "CertificationStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProtectedPaymentStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'PROTECTED', 'APPROVED_FOR_PAYOUT', 'DISPUTED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('FIXED', 'HOURLY', 'DAILY', 'TECHNICAL_VISIT', 'OPEN_TO_OFFERS');

-- CreateEnum
CREATE TYPE "MediaPurpose" AS ENUM ('AVATAR', 'PROVIDER_PORTFOLIO', 'VERIFICATION_DOCUMENT', 'VERIFICATION_SELFIE', 'TASK_PHOTO', 'TASK_VIDEO', 'BOOKING_EVIDENCE', 'DISPUTE_EVIDENCE');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('UPLOADED', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'DELETED');

-- CreateEnum
CREATE TYPE "LocationVisibility" AS ENUM ('PRIVATE', 'APPROXIMATE', 'BOOKING_ONLY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BookingStatus" ADD VALUE IF NOT EXISTS 'CONFIRMED';
ALTER TYPE "BookingStatus" ADD VALUE IF NOT EXISTS 'COMPLETED_BY_PROVIDER';
ALTER TYPE "BookingStatus" ADD VALUE IF NOT EXISTS 'CONFIRMED_BY_CLIENT';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OfferStatus" ADD VALUE IF NOT EXISTS 'SENT';
ALTER TYPE "OfferStatus" ADD VALUE IF NOT EXISTS 'VIEWED';
ALTER TYPE "OfferStatus" ADD VALUE IF NOT EXISTS 'COUNTERED';
ALTER TYPE "OfferStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TaskStatus" ADD VALUE IF NOT EXISTS 'OFFER_ACCEPTED';
ALTER TYPE "TaskStatus" ADD VALUE IF NOT EXISTS 'PROTECTED_PAYMENT_CONFIRMED';
ALTER TYPE "TaskStatus" ADD VALUE IF NOT EXISTS 'DISPUTED';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';

COMMIT;
BEGIN;

-- DropForeignKey
ALTER TABLE "MediaFile" DROP CONSTRAINT "MediaFile_uploaderId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_categoryId_fkey";

-- DropIndex
DROP INDEX "MediaFile_uploaderId_idx";

-- DropIndex
DROP INDEX "ProviderProfile_status_idx";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "agreedPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "protectedPaymentStatus" "ProtectedPaymentStatus" NOT NULL DEFAULT 'NOT_STARTED',
ALTER COLUMN "status" SET DEFAULT 'CONFIRMED';

-- AlterTable
ALTER TABLE "ClientProfile" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "phoneNumber",
ADD COLUMN     "avatarMediaId" TEXT,
ADD COLUMN     "displayName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MediaFile" DROP COLUMN "size",
DROP COLUMN "type",
DROP COLUMN "uploaderId",
DROP COLUMN "url",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "ownerUserId" TEXT NOT NULL,
ADD COLUMN     "privateUrl" TEXT,
ADD COLUMN     "publicUrl" TEXT,
ADD COLUMN     "purpose" "MediaPurpose" NOT NULL,
ADD COLUMN     "sizeBytes" INTEGER NOT NULL,
ADD COLUMN     "status" "MediaStatus" NOT NULL DEFAULT 'UPLOADED',
ADD COLUMN     "storageKey" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "contactWarning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "estimatedDuration" TEXT,
ADD COLUMN     "includesMaterials" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresTechnicalVisit" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'SENT';

-- AlterTable
ALTER TABLE "ProviderProfile" DROP COLUMN "city",
DROP COLUMN "hourlyRate",
DROP COLUMN "phoneNumber",
DROP COLUMN "status",
ADD COLUMN     "avatarMediaId" TEXT,
ADD COLUMN     "completedJobs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "displayName" TEXT NOT NULL,
ADD COLUMN     "level" "ProviderLevel" NOT NULL DEFAULT 'LEVEL_0',
ADD COLUMN     "verificationStatus" "ProviderVerificationStatus" NOT NULL DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "budgetMax" DECIMAL(10,2),
ADD COLUMN     "budgetMin" DECIMAL(10,2),
ADD COLUMN     "categoryName" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "locationId" TEXT,
ADD COLUMN     "pricingType" "PricingType" NOT NULL DEFAULT 'OPEN_TO_OFFERS',
ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "hashedPassword",
DROP COLUMN "isActive",
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'PENDING_EMAIL_VERIFICATION';

-- DropEnum
DROP TYPE "ProviderStatus";

-- CreateTable
CREATE TABLE "ProviderVerification" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "status" "ProviderVerificationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "identityDocumentFrontMediaId" TEXT NOT NULL,
    "identityDocumentBackMediaId" TEXT,
    "selfieMediaId" TEXT,
    "notes" TEXT,
    "reviewedByAdminId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderCertification" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT,
    "mediaId" TEXT NOT NULL,
    "status" "CertificationStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "reviewedByAdminId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "label" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Nicaragua',
    "department" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "accuracyMeters" INTEGER,
    "isExact" BOOLEAN NOT NULL DEFAULT false,
    "visibility" "LocationVisibility" NOT NULL DEFAULT 'APPROXIMATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProviderVerification_providerId_idx" ON "ProviderVerification"("providerId");

-- CreateIndex
CREATE INDEX "ProviderVerification_status_idx" ON "ProviderVerification"("status");

-- CreateIndex
CREATE INDEX "ProviderVerification_reviewedByAdminId_idx" ON "ProviderVerification"("reviewedByAdminId");

-- CreateIndex
CREATE INDEX "ProviderCertification_providerId_idx" ON "ProviderCertification"("providerId");

-- CreateIndex
CREATE INDEX "ProviderCertification_status_idx" ON "ProviderCertification"("status");

-- CreateIndex
CREATE INDEX "Location_ownerUserId_idx" ON "Location"("ownerUserId");

-- CreateIndex
CREATE INDEX "Location_visibility_idx" ON "Location"("visibility");

-- CreateIndex
CREATE INDEX "Location_city_zone_idx" ON "Location"("city", "zone");

-- CreateIndex
CREATE INDEX "MediaFile_ownerUserId_idx" ON "MediaFile"("ownerUserId");

-- CreateIndex
CREATE INDEX "MediaFile_purpose_idx" ON "MediaFile"("purpose");

-- CreateIndex
CREATE INDEX "MediaFile_status_idx" ON "MediaFile"("status");

-- CreateIndex
CREATE INDEX "ProviderProfile_verificationStatus_idx" ON "ProviderProfile"("verificationStatus");

-- CreateIndex
CREATE INDEX "ProviderProfile_level_idx" ON "ProviderProfile"("level");

-- CreateIndex
CREATE INDEX "Task_locationId_idx" ON "Task"("locationId");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_avatarMediaId_fkey" FOREIGN KEY ("avatarMediaId") REFERENCES "MediaFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_avatarMediaId_fkey" FOREIGN KEY ("avatarMediaId") REFERENCES "MediaFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaFile" ADD CONSTRAINT "MediaFile_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderVerification" ADD CONSTRAINT "ProviderVerification_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderVerification" ADD CONSTRAINT "ProviderVerification_identityDocumentFrontMediaId_fkey" FOREIGN KEY ("identityDocumentFrontMediaId") REFERENCES "MediaFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderVerification" ADD CONSTRAINT "ProviderVerification_identityDocumentBackMediaId_fkey" FOREIGN KEY ("identityDocumentBackMediaId") REFERENCES "MediaFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderVerification" ADD CONSTRAINT "ProviderVerification_selfieMediaId_fkey" FOREIGN KEY ("selfieMediaId") REFERENCES "MediaFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderVerification" ADD CONSTRAINT "ProviderVerification_reviewedByAdminId_fkey" FOREIGN KEY ("reviewedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCertification" ADD CONSTRAINT "ProviderCertification_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCertification" ADD CONSTRAINT "ProviderCertification_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCertification" ADD CONSTRAINT "ProviderCertification_reviewedByAdminId_fkey" FOREIGN KEY ("reviewedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;

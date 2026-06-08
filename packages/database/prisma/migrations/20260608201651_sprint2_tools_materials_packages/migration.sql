-- CreateEnum
CREATE TYPE "ToolRequirement" AS ENUM ('CLIENT_PROVIDES_TOOLS', 'PROVIDER_BRINGS_TOOLS', 'NO_TOOLS_REQUIRED');

-- CreateEnum
CREATE TYPE "MaterialResponsibility" AS ENUM ('CLIENT_ALREADY_HAS_MATERIALS', 'CLIENT_NEEDS_PURCHASE_LIST', 'NEEDS_DIAGNOSIS_FIRST', 'NO_MATERIALS_REQUIRED');

-- CreateEnum
CREATE TYPE "MaterialStatus" AS ENUM ('NO_MATERIALS_REQUIRED', 'CLIENT_ALREADY_HAS_MATERIALS', 'PURCHASE_LIST_PENDING_PROVIDER', 'PURCHASE_LIST_SENT', 'CLIENT_BUYING_MATERIALS', 'MATERIALS_READY', 'MATERIALS_INCORRECT', 'MISSING_MATERIALS', 'NEEDS_UPDATE');

-- CreateEnum
CREATE TYPE "MaterialItemPriority" AS ENUM ('REQUIRED', 'OPTIONAL', 'RECOMMENDED', 'ALTERNATIVE');

-- CreateEnum
CREATE TYPE "StoreType" AS ENUM ('HARDWARE_STORE', 'HOME_IMPROVEMENT', 'ELECTRICAL_SUPPLY', 'PLUMBING_SUPPLY', 'PAINT_STORE', 'GENERAL_STORE', 'OTHER');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "materialResponsibility" "MaterialResponsibility" NOT NULL DEFAULT 'NO_MATERIALS_REQUIRED',
ADD COLUMN     "materialStatus" "MaterialStatus" NOT NULL DEFAULT 'NO_MATERIALS_REQUIRED',
ADD COLUMN     "requiredTools" JSONB,
ADD COLUMN     "toolRequirement" "ToolRequirement" NOT NULL DEFAULT 'NO_TOOLS_REQUIRED';

-- CreateTable
CREATE TABLE "ProviderTool" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseList" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "providerId" TEXT,
    "status" "MaterialStatus" NOT NULL DEFAULT 'PURCHASE_LIST_PENDING_PROVIDER',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseListItem" (
    "id" TEXT NOT NULL,
    "purchaseListId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "specification" TEXT,
    "priority" "MaterialItemPriority" NOT NULL DEFAULT 'REQUIRED',
    "estimatedPriceMin" DECIMAL(10,2),
    "estimatedPriceMax" DECIMAL(10,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerStore" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "StoreType" NOT NULL,
    "description" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Nicaragua',
    "department" TEXT,
    "city" TEXT,
    "zone" TEXT,
    "addressLine" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "phoneInternal" TEXT,
    "websiteUrl" TEXT,
    "isSponsored" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseListStoreSuggestion" (
    "id" TEXT NOT NULL,
    "purchaseListId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "reason" TEXT,
    "isSponsored" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseListStoreSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageProject" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "providerId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "estimatedStartDate" TIMESTAMP(3),
    "estimatedEndDate" TIMESTAMP(3),
    "totalPrice" DECIMAL(10,2),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceBlock" (
    "id" TEXT NOT NULL,
    "packageProjectId" TEXT NOT NULL,
    "bookingId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "checkInAt" TIMESTAMP(3),
    "checkOutAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "providerPresenceStatus" TEXT NOT NULL DEFAULT 'NOT_REQUIRED_YET',
    "clientConfirmationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProviderTool_providerId_idx" ON "ProviderTool"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseList_taskId_key" ON "PurchaseList"("taskId");

-- CreateIndex
CREATE INDEX "PurchaseList_providerId_idx" ON "PurchaseList"("providerId");

-- CreateIndex
CREATE INDEX "PurchaseList_status_idx" ON "PurchaseList"("status");

-- CreateIndex
CREATE INDEX "PurchaseListItem_purchaseListId_idx" ON "PurchaseListItem"("purchaseListId");

-- CreateIndex
CREATE INDEX "PartnerStore_type_idx" ON "PartnerStore"("type");

-- CreateIndex
CREATE INDEX "PartnerStore_isActive_idx" ON "PartnerStore"("isActive");

-- CreateIndex
CREATE INDEX "PartnerStore_department_idx" ON "PartnerStore"("department");

-- CreateIndex
CREATE INDEX "PurchaseListStoreSuggestion_purchaseListId_idx" ON "PurchaseListStoreSuggestion"("purchaseListId");

-- CreateIndex
CREATE INDEX "PurchaseListStoreSuggestion_storeId_idx" ON "PurchaseListStoreSuggestion"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "PackageProject_taskId_key" ON "PackageProject"("taskId");

-- CreateIndex
CREATE INDEX "PackageProject_clientId_idx" ON "PackageProject"("clientId");

-- CreateIndex
CREATE INDEX "PackageProject_providerId_idx" ON "PackageProject"("providerId");

-- CreateIndex
CREATE INDEX "PackageProject_status_idx" ON "PackageProject"("status");

-- CreateIndex
CREATE INDEX "ServiceBlock_packageProjectId_idx" ON "ServiceBlock"("packageProjectId");

-- CreateIndex
CREATE INDEX "ServiceBlock_status_idx" ON "ServiceBlock"("status");

-- AddForeignKey
ALTER TABLE "ProviderTool" ADD CONSTRAINT "ProviderTool_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseList" ADD CONSTRAINT "PurchaseList_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseList" ADD CONSTRAINT "PurchaseList_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseListItem" ADD CONSTRAINT "PurchaseListItem_purchaseListId_fkey" FOREIGN KEY ("purchaseListId") REFERENCES "PurchaseList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseListStoreSuggestion" ADD CONSTRAINT "PurchaseListStoreSuggestion_purchaseListId_fkey" FOREIGN KEY ("purchaseListId") REFERENCES "PurchaseList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseListStoreSuggestion" ADD CONSTRAINT "PurchaseListStoreSuggestion_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "PartnerStore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageProject" ADD CONSTRAINT "PackageProject_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageProject" ADD CONSTRAINT "PackageProject_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageProject" ADD CONSTRAINT "PackageProject_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBlock" ADD CONSTRAINT "ServiceBlock_packageProjectId_fkey" FOREIGN KEY ("packageProjectId") REFERENCES "PackageProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;


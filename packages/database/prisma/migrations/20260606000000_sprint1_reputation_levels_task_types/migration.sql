-- Sprint 1: niveles de reputación, confianza, inactividad y tipos de Tarea.
-- Mapea los valores antiguos de ProviderLevel a los nuevos para no perder datos.

-- CreateEnum
CREATE TYPE "ClientLevel" AS ENUM ('CLIENT_0_NEW', 'CLIENT_1_VERIFIED', 'CLIENT_2_TRUSTED', 'CLIENT_3_GOLD');

-- CreateEnum
CREATE TYPE "TrustStatus" AS ENUM ('NORMAL', 'WATCHLIST', 'RESTRICTED', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "InactivityStatus" AS ENUM ('ACTIVE', 'AVAILABLE', 'BUSY', 'PAUSED_VOLUNTARILY', 'VACATION_OR_OUT_OF_SERVICE', 'INACTIVE_SILENT', 'REACTIVATION_REQUIRED');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('QUICK_TASK', 'STANDARD_TASK', 'PACKAGE_PROJECT');

-- CreateEnum
CREATE TYPE "QuickTaskMode" AS ENUM ('DIRECT_ACCEPT', 'QUICK_AUCTION');

-- CreateEnum
CREATE TYPE "ReputationEventType" AS ENUM ('TASK_COMPLETED', 'GOOD_REVIEW', 'BAD_REVIEW', 'LATE_CANCELLATION', 'SAME_DAY_CANCELLATION', 'NO_SHOW', 'ABANDONED_TASK', 'INCOMPLETE_TASK', 'EXTERNAL_CONTACT_ATTEMPT', 'EXTERNAL_PAYMENT_ATTEMPT', 'INACTIVITY_SILENT', 'MANUAL_ADMIN_ADJUSTMENT');

-- AlterEnum
BEGIN;
CREATE TYPE "ProviderLevel_new" AS ENUM ('LEVEL_0_NEW', 'LEVEL_1_VERIFIED', 'LEVEL_2_TRUSTED', 'LEVEL_3_GOLD', 'LEVEL_4_PLATINUM', 'LEVEL_5_DIAMOND');
ALTER TABLE "ProviderProfile" ALTER COLUMN "level" DROP DEFAULT;
ALTER TABLE "ProviderProfile" ALTER COLUMN "level" TYPE "ProviderLevel_new" USING (
  CASE "level"::text
    WHEN 'LEVEL_0' THEN 'LEVEL_0_NEW'
    WHEN 'LEVEL_1' THEN 'LEVEL_1_VERIFIED'
    WHEN 'LEVEL_2' THEN 'LEVEL_2_TRUSTED'
    WHEN 'LEVEL_3' THEN 'LEVEL_3_GOLD'
    WHEN 'LEVEL_4_PRO' THEN 'LEVEL_4_PLATINUM'
    WHEN 'LEVEL_5_PREMIUM' THEN 'LEVEL_5_DIAMOND'
    ELSE 'LEVEL_0_NEW'
  END::"ProviderLevel_new"
);
ALTER TYPE "ProviderLevel" RENAME TO "ProviderLevel_old";
ALTER TYPE "ProviderLevel_new" RENAME TO "ProviderLevel";
DROP TYPE "ProviderLevel_old";
ALTER TABLE "ProviderProfile" ALTER COLUMN "level" SET DEFAULT 'LEVEL_0_NEW';
COMMIT;

-- AlterTable
ALTER TABLE "ClientProfile" ADD COLUMN     "cancelledTasksCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completedTasksAsClient" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "inactivityStatus" "InactivityStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "level" "ClientLevel" NOT NULL DEFAULT 'CLIENT_0_NEW',
ADD COLUMN     "ratingAverage" DECIMAL(3,2),
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trustScore" INTEGER NOT NULL DEFAULT 70,
ADD COLUMN     "trustStatus" "TrustStatus" NOT NULL DEFAULT 'NORMAL';

-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN     "inactivityStartedAt" TIMESTAMP(3),
ADD COLUMN     "inactivityStatus" "InactivityStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastResponseAt" TIMESTAMP(3),
ADD COLUMN     "reactivationRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trustScore" INTEGER NOT NULL DEFAULT 70,
ADD COLUMN     "trustStatus" "TrustStatus" NOT NULL DEFAULT 'NORMAL',
ALTER COLUMN "level" SET DEFAULT 'LEVEL_0_NEW';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "estimatedDurationMinutes" INTEGER,
ADD COLUMN     "minProviderRating" DECIMAL(3,2),
ADD COLUMN     "minProviderTrustScore" INTEGER,
ADD COLUMN     "quickTaskMode" "QuickTaskMode",
ADD COLUMN     "radiusKm" DECIMAL(8,2),
ADD COLUMN     "taskType" "TaskType" NOT NULL DEFAULT 'STANDARD_TASK';

-- CreateTable
CREATE TABLE "ReputationEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "eventType" "ReputationEventType" NOT NULL,
    "scoreImpact" INTEGER NOT NULL,
    "reason" TEXT,
    "relatedTaskId" TEXT,
    "relatedBookingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReputationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReputationEvent_userId_idx" ON "ReputationEvent"("userId");

-- CreateIndex
CREATE INDEX "ReputationEvent_eventType_idx" ON "ReputationEvent"("eventType");

-- CreateIndex
CREATE INDEX "ReputationEvent_role_idx" ON "ReputationEvent"("role");

-- CreateIndex
CREATE INDEX "ClientProfile_level_idx" ON "ClientProfile"("level");

-- CreateIndex
CREATE INDEX "ClientProfile_trustStatus_idx" ON "ClientProfile"("trustStatus");

-- CreateIndex
CREATE INDEX "ProviderProfile_trustStatus_idx" ON "ProviderProfile"("trustStatus");

-- CreateIndex
CREATE INDEX "Task_taskType_idx" ON "Task"("taskType");

-- AddForeignKey
ALTER TABLE "ReputationEvent" ADD CONSTRAINT "ReputationEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReputationEvent" ADD CONSTRAINT "ReputationEvent_relatedTaskId_fkey" FOREIGN KEY ("relatedTaskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReputationEvent" ADD CONSTRAINT "ReputationEvent_relatedBookingId_fkey" FOREIGN KEY ("relatedBookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;


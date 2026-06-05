-- CreateTable
CREATE TABLE "TaskMedia" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderPortfolioMedia" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderPortfolioMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingEvidenceMedia" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingEvidenceMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskMedia_taskId_idx" ON "TaskMedia"("taskId");

-- CreateIndex
CREATE INDEX "TaskMedia_mediaId_idx" ON "TaskMedia"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskMedia_taskId_mediaId_key" ON "TaskMedia"("taskId", "mediaId");

-- CreateIndex
CREATE INDEX "ProviderPortfolioMedia_providerId_idx" ON "ProviderPortfolioMedia"("providerId");

-- CreateIndex
CREATE INDEX "ProviderPortfolioMedia_mediaId_idx" ON "ProviderPortfolioMedia"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderPortfolioMedia_providerId_mediaId_key" ON "ProviderPortfolioMedia"("providerId", "mediaId");

-- CreateIndex
CREATE INDEX "BookingEvidenceMedia_bookingId_idx" ON "BookingEvidenceMedia"("bookingId");

-- CreateIndex
CREATE INDEX "BookingEvidenceMedia_mediaId_idx" ON "BookingEvidenceMedia"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "BookingEvidenceMedia_bookingId_mediaId_key" ON "BookingEvidenceMedia"("bookingId", "mediaId");

-- AddForeignKey
ALTER TABLE "TaskMedia" ADD CONSTRAINT "TaskMedia_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskMedia" ADD CONSTRAINT "TaskMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderPortfolioMedia" ADD CONSTRAINT "ProviderPortfolioMedia_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderPortfolioMedia" ADD CONSTRAINT "ProviderPortfolioMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingEvidenceMedia" ADD CONSTRAINT "BookingEvidenceMedia_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingEvidenceMedia" ADD CONSTRAINT "BookingEvidenceMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

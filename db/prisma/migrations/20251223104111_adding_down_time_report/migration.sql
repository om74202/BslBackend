-- AlterTable
ALTER TABLE "PlannedShutdown" ADD COLUMN     "downtimeReportId" TEXT;

-- CreateTable
CREATE TABLE "DowntimeReport" (
    "id" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "shift" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "rows" JSONB NOT NULL,

    CONSTRAINT "DowntimeReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DowntimeReport_lineId_reportDate_shift_key" ON "DowntimeReport"("lineId", "reportDate", "shift");

-- AddForeignKey
ALTER TABLE "PlannedShutdown" ADD CONSTRAINT "PlannedShutdown_downtimeReportId_fkey" FOREIGN KEY ("downtimeReportId") REFERENCES "DowntimeReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DowntimeReport" ADD CONSTRAINT "DowntimeReport_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DowntimeReport" ADD CONSTRAINT "DowntimeReport_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

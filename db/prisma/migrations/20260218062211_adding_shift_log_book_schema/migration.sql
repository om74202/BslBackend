-- CreateTable
CREATE TABLE "ShiftLogBook" (
    "id" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "reportDate" TEXT NOT NULL,
    "shift" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShiftLogBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShiftLogBook_lineId_reportDate_shift_idx" ON "ShiftLogBook"("lineId", "reportDate", "shift");

-- CreateIndex
CREATE UNIQUE INDEX "ShiftLogBook_lineId_reportDate_shift_key" ON "ShiftLogBook"("lineId", "reportDate", "shift");

-- AddForeignKey
ALTER TABLE "ShiftLogBook" ADD CONSTRAINT "ShiftLogBook_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE RESTRICT ON UPDATE CASCADE;

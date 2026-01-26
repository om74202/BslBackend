-- CreateEnum
CREATE TYPE "DowntimeType" AS ENUM ('Planned', 'Unplanned');

-- CreateTable
CREATE TABLE "DowntimeManagement" (
    "id" TEXT NOT NULL,
    "type" "DowntimeType" NOT NULL,
    "reason" TEXT NOT NULL,
    "reasonType" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "lineId" TEXT NOT NULL,

    CONSTRAINT "DowntimeManagement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DowntimeManagement" ADD CONSTRAINT "DowntimeManagement_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE RESTRICT ON UPDATE CASCADE;

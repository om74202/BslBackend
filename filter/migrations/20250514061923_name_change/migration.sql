/*
  Warnings:

  - The primary key for the `Line` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customShiftCount` on the `Line` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Line` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Line` table. All the data in the column will be lost.
  - You are about to drop the column `shiftCount` on the `Line` table. All the data in the column will be lost.
  - You are about to drop the column `stationCount` on the `Line` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Line` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `PlannedBreak` table. All the data in the column will be lost.
  - You are about to drop the column `isCritical` on the `Station` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CustomShift` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shift` table. If the table is not empty, all the data it contains will be lost.
  - The required column `lineId` was added to the `Line` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `lineName` to the `Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineType` to the `Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noOfCustomShifts` to the `Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noOfShifts` to the `Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noOfStations` to the `Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeOfBreak` to the `PlannedBreak` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CustomShift" DROP CONSTRAINT "CustomShift_lineId_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_lineId_fkey";

-- DropForeignKey
ALTER TABLE "PlannedBreak" DROP CONSTRAINT "PlannedBreak_ShiftId_fkey";

-- DropForeignKey
ALTER TABLE "PlannedBreakCustom" DROP CONSTRAINT "PlannedBreakCustom_customShiftTimingId_fkey";

-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Station" DROP CONSTRAINT "Station_lineId_fkey";

-- DropForeignKey
ALTER TABLE "_LineShift" DROP CONSTRAINT "_LineShift_A_fkey";

-- DropForeignKey
ALTER TABLE "_LineShift" DROP CONSTRAINT "_LineShift_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserLine" DROP CONSTRAINT "_UserLine_A_fkey";

-- AlterTable
ALTER TABLE "Line" DROP CONSTRAINT "Line_pkey",
DROP COLUMN "customShiftCount",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "shiftCount",
DROP COLUMN "stationCount",
DROP COLUMN "type",
ADD COLUMN     "lineId" TEXT NOT NULL,
ADD COLUMN     "lineName" TEXT NOT NULL,
ADD COLUMN     "lineType" TEXT NOT NULL,
ADD COLUMN     "noOfCustomShifts" INTEGER NOT NULL,
ADD COLUMN     "noOfShifts" INTEGER NOT NULL,
ADD COLUMN     "noOfStations" INTEGER NOT NULL,
ADD CONSTRAINT "Line_pkey" PRIMARY KEY ("lineId");

-- AlterTable
ALTER TABLE "PlannedBreak" DROP COLUMN "type",
ADD COLUMN     "typeOfBreak" "TypeOfBreak" NOT NULL;

-- AlterTable
ALTER TABLE "Station" DROP COLUMN "isCritical",
ADD COLUMN     "Pokayoke" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageUrl",
ADD COLUMN     "uploadImageUrl" TEXT;

-- DropTable
DROP TABLE "CustomShift";

-- DropTable
DROP TABLE "Shift";

-- CreateTable
CREATE TABLE "ShiftTimings" (
    "id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "ShiftTimings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomShiftsTimings" (
    "id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,

    CONSTRAINT "CustomShiftsTimings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShiftTimings" ADD CONSTRAINT "ShiftTimings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomShiftsTimings" ADD CONSTRAINT "CustomShiftsTimings_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedBreakCustom" ADD CONSTRAINT "PlannedBreakCustom_customShiftTimingId_fkey" FOREIGN KEY ("customShiftTimingId") REFERENCES "CustomShiftsTimings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedBreak" ADD CONSTRAINT "PlannedBreak_ShiftId_fkey" FOREIGN KEY ("ShiftId") REFERENCES "ShiftTimings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLine" ADD CONSTRAINT "_UserLine_A_fkey" FOREIGN KEY ("A") REFERENCES "Line"("lineId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineShift" ADD CONSTRAINT "_LineShift_A_fkey" FOREIGN KEY ("A") REFERENCES "Line"("lineId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineShift" ADD CONSTRAINT "_LineShift_B_fkey" FOREIGN KEY ("B") REFERENCES "ShiftTimings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

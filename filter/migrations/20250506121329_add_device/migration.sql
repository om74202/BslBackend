/*
  Warnings:

  - You are about to drop the `_ShiftToline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `line` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('Active', 'Inactive', 'Maintenance');

-- DropForeignKey
ALTER TABLE "CustomShift" DROP CONSTRAINT "CustomShift_lineId_fkey";

-- DropForeignKey
ALTER TABLE "Station" DROP CONSTRAINT "Station_lineId_fkey";

-- DropForeignKey
ALTER TABLE "_ShiftToline" DROP CONSTRAINT "_ShiftToline_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShiftToline" DROP CONSTRAINT "_ShiftToline_B_fkey";

-- DropTable
DROP TABLE "_ShiftToline";

-- DropTable
DROP TABLE "line";

-- CreateTable
CREATE TABLE "Line" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "status" "DeviceStatus" NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LineToShift" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LineToShift_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LineToShift_B_index" ON "_LineToShift"("B");

-- AddForeignKey
ALTER TABLE "CustomShift" ADD CONSTRAINT "CustomShift_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineToShift" ADD CONSTRAINT "_LineToShift_A_fkey" FOREIGN KEY ("A") REFERENCES "Line"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineToShift" ADD CONSTRAINT "_LineToShift_B_fkey" FOREIGN KEY ("B") REFERENCES "Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

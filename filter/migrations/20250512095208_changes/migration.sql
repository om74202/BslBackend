/*
  Warnings:

  - You are about to drop the column `shiftNumber` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `plannedBreaksCustomCount` to the `CustomShift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customShiftCount` to the `Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftCount` to the `Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stationCount` to the `Line` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftCount` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plannedBreaksCount` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomShift" ADD COLUMN     "plannedBreaksCustomCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Line" ADD COLUMN     "customShiftCount" INTEGER NOT NULL,
ADD COLUMN     "shiftCount" INTEGER NOT NULL,
ADD COLUMN     "stationCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "shiftNumber",
ADD COLUMN     "shiftCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "plannedBreaksCount" INTEGER NOT NULL;

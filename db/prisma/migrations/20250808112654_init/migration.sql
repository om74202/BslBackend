/*
  Warnings:

  - Changed the type of `typeOfBreak` on the `PlannedBreak` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PlannedBreak" ADD COLUMN     "lineName" TEXT,
DROP COLUMN "typeOfBreak",
ADD COLUMN     "typeOfBreak" TEXT NOT NULL;

/*
  Warnings:

  - Made the column `lineType` on table `Line` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Line" ALTER COLUMN "lineType" SET NOT NULL;

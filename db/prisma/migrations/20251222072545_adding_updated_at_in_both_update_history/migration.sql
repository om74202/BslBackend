/*
  Warnings:

  - Added the required column `updatedValue` to the `PlannedShutdownUpdateHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlannedShutdownUpdateHistory" ADD COLUMN     "updatedValue" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "TargetJPHUpdateHistory" ADD COLUMN     "updatedValue" INTEGER;

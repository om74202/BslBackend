/*
  Warnings:

  - You are about to drop the `DowntimeReasons` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "shutdownType" AS ENUM ('Holiday', 'PlannedShutdown');

-- AlterTable
ALTER TABLE "Line" ADD COLUMN     "targetJPH" INTEGER;

-- DropTable
DROP TABLE "DowntimeReasons";

-- CreateTable
CREATE TABLE "TargetJPHUpdateHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lineId" TEXT NOT NULL,

    CONSTRAINT "TargetJPHUpdateHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionLossReasons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "options" TEXT[],

    CONSTRAINT "ProductionLossReasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedShutdown" (
    "id" TEXT NOT NULL,
    "type" "shutdownType" NOT NULL,
    "isFullDay" BOOLEAN NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlannedShutdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedShutdownUpdateHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stopEmail" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plannedShutdownId" TEXT NOT NULL,

    CONSTRAINT "PlannedShutdownUpdateHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductionLossReasons_name_key" ON "ProductionLossReasons"("name");

-- AddForeignKey
ALTER TABLE "TargetJPHUpdateHistory" ADD CONSTRAINT "TargetJPHUpdateHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TargetJPHUpdateHistory" ADD CONSTRAINT "TargetJPHUpdateHistory_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedShutdown" ADD CONSTRAINT "PlannedShutdown_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedShutdownUpdateHistory" ADD CONSTRAINT "PlannedShutdownUpdateHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedShutdownUpdateHistory" ADD CONSTRAINT "PlannedShutdownUpdateHistory_plannedShutdownId_fkey" FOREIGN KEY ("plannedShutdownId") REFERENCES "PlannedShutdown"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

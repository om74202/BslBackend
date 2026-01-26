/*
  Warnings:

  - You are about to drop the column `isFullDay` on the `PlannedShutdown` table. All the data in the column will be lost.
  - You are about to drop the column `stopEmail` on the `PlannedShutdownUpdateHistory` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "shutdownType" ADD VALUE 'UnplannedDowntime';

-- AlterTable
ALTER TABLE "PlannedShutdown" DROP COLUMN "isFullDay";

-- AlterTable
ALTER TABLE "PlannedShutdownUpdateHistory" DROP COLUMN "stopEmail";

-- CreateTable
CREATE TABLE "_LinePlannedShutdowns" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LinePlannedShutdowns_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LinePlannedShutdowns_B_index" ON "_LinePlannedShutdowns"("B");

-- AddForeignKey
ALTER TABLE "_LinePlannedShutdowns" ADD CONSTRAINT "_LinePlannedShutdowns_A_fkey" FOREIGN KEY ("A") REFERENCES "Line"("lineId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinePlannedShutdowns" ADD CONSTRAINT "_LinePlannedShutdowns_B_fkey" FOREIGN KEY ("B") REFERENCES "PlannedShutdown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

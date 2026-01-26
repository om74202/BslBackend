/*
  Warnings:

  - Made the column `lineId` on table `SubAssembly` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SubAssembly" DROP CONSTRAINT "SubAssembly_lineId_fkey";

-- AlterTable
ALTER TABLE "SubAssembly" ALTER COLUMN "lineId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SubAssembly" ADD CONSTRAINT "SubAssembly_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE RESTRICT ON UPDATE CASCADE;

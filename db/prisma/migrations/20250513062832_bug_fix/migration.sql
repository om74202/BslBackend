/*
  Warnings:

  - You are about to drop the `_LineToShift` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lineId` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_LineToShift" DROP CONSTRAINT "_LineToShift_A_fkey";

-- DropForeignKey
ALTER TABLE "_LineToShift" DROP CONSTRAINT "_LineToShift_B_fkey";

-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "lineId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_LineToShift";

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

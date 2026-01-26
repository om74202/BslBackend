/*
  Warnings:

  - You are about to drop the column `lineId` on the `Shift` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_lineId_fkey";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "lineId";

-- CreateTable
CREATE TABLE "_LineShift" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LineShift_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LineShift_B_index" ON "_LineShift"("B");

-- AddForeignKey
ALTER TABLE "_LineShift" ADD CONSTRAINT "_LineShift_A_fkey" FOREIGN KEY ("A") REFERENCES "Line"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineShift" ADD CONSTRAINT "_LineShift_B_fkey" FOREIGN KEY ("B") REFERENCES "Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

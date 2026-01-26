/*
  Warnings:

  - You are about to drop the column `userId` on the `Line` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Line" DROP CONSTRAINT "Line_userId_fkey";

-- AlterTable
ALTER TABLE "Line" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_LineToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LineToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LineToUser_B_index" ON "_LineToUser"("B");

-- AddForeignKey
ALTER TABLE "_LineToUser" ADD CONSTRAINT "_LineToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Line"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineToUser" ADD CONSTRAINT "_LineToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

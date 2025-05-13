/*
  Warnings:

  - You are about to drop the `_LineToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LineToUser" DROP CONSTRAINT "_LineToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LineToUser" DROP CONSTRAINT "_LineToUser_B_fkey";

-- DropTable
DROP TABLE "_LineToUser";

-- CreateTable
CREATE TABLE "_UserLine" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserLine_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserLine_B_index" ON "_UserLine"("B");

-- AddForeignKey
ALTER TABLE "_UserLine" ADD CONSTRAINT "_UserLine_A_fkey" FOREIGN KEY ("A") REFERENCES "Line"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLine" ADD CONSTRAINT "_UserLine_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `userId` to the `Line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Line" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

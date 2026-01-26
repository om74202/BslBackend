/*
  Warnings:

  - You are about to drop the column `name` on the `ProductionLossReasons` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `ProductionLossReasons` table. All the data in the column will be lost.
  - Added the required column `lossCode` to the `ProductionLossReasons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lossReason` to the `ProductionLossReasons` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProductionLossReasons_name_key";

-- AlterTable
ALTER TABLE "ProductionLossReasons" DROP COLUMN "name",
DROP COLUMN "options",
ADD COLUMN     "lossCode" TEXT NOT NULL,
ADD COLUMN     "lossReason" TEXT NOT NULL,
ADD COLUMN     "lossSubReason" TEXT[];

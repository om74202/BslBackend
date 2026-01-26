/*
  Warnings:

  - You are about to drop the column `type` on the `IdealParameters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IdealParameters" DROP COLUMN "type",
ADD COLUMN     "JPH" TEXT NOT NULL DEFAULT '50',
ADD COLUMN     "Quality" TEXT NOT NULL DEFAULT '99';

/*
  Warnings:

  - The `lineType` column on the `Line` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `subAssemblyId` on the `Station` table. All the data in the column will be lost.
  - You are about to drop the `SubAssembly` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "lineType" AS ENUM ('mainLine', 'subAssemblyLine');

-- DropForeignKey
ALTER TABLE "Station" DROP CONSTRAINT "Station_subAssemblyId_fkey";

-- DropForeignKey
ALTER TABLE "SubAssembly" DROP CONSTRAINT "SubAssembly_lineId_fkey";

-- AlterTable
ALTER TABLE "Line" DROP COLUMN "lineType",
ADD COLUMN     "lineType" "lineType";

-- AlterTable
ALTER TABLE "Station" DROP COLUMN "subAssemblyId";

-- DropTable
DROP TABLE "SubAssembly";

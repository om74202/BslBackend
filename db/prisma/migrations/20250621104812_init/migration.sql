/*
  Warnings:

  - The `status` column on the `Maintenance` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "maintenanceStatus" AS ENUM ('open', 'close');

-- AlterTable
ALTER TABLE "Maintenance" DROP COLUMN "status",
ADD COLUMN     "status" "maintenanceStatus" NOT NULL DEFAULT 'open';

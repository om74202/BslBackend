/*
  Warnings:

  - You are about to drop the column `deviceName` on the `GpsDevice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `GpsDevice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `GpsDevice` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "GpsDevice_deviceName_key";

-- AlterTable
ALTER TABLE "GpsDevice" DROP COLUMN "deviceName",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GpsDevice_name_key" ON "GpsDevice"("name");

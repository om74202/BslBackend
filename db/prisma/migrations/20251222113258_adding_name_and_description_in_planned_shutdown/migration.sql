/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `PlannedShutdown` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `PlannedShutdown` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlannedShutdown" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PlannedShutdown_name_key" ON "PlannedShutdown"("name");

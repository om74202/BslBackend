/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,checksheetName]` on the table `Checksheet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Checksheet_organizationId_checksheetName_key" ON "Checksheet"("organizationId", "checksheetName");

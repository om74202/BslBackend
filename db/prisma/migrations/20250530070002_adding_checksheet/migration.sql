-- CreateEnum
CREATE TYPE "ChecksheetType" AS ENUM ('Filled', 'Template');

-- CreateTable
CREATE TABLE "Checksheet" (
    "checksheetId" TEXT NOT NULL,
    "checksheetName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "checksheetData" BYTEA NOT NULL,
    "organizationId" TEXT NOT NULL,
    "checksheetType" "ChecksheetType" NOT NULL,

    CONSTRAINT "Checksheet_pkey" PRIMARY KEY ("checksheetId")
);

-- AddForeignKey
ALTER TABLE "Checksheet" ADD CONSTRAINT "Checksheet_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

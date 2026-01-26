-- DropForeignKey
ALTER TABLE "PlannedShutdown" DROP CONSTRAINT "PlannedShutdown_createdBy_fkey";

-- AlterTable
ALTER TABLE "PlannedShutdown" ADD COLUMN     "reason" TEXT,
ALTER COLUMN "createdBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PlannedShutdown" ADD CONSTRAINT "PlannedShutdown_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

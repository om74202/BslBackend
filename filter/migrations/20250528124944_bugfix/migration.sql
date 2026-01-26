-- DropForeignKey
ALTER TABLE "SubAssembly" DROP CONSTRAINT "SubAssembly_lineId_fkey";

-- AlterTable
ALTER TABLE "SubAssembly" ALTER COLUMN "lineId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SubAssembly" ADD CONSTRAINT "SubAssembly_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE SET NULL ON UPDATE CASCADE;

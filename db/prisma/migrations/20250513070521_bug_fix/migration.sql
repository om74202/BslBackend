-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_lineId_fkey";

-- AlterTable
ALTER TABLE "Shift" ALTER COLUMN "lineId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE SET NULL ON UPDATE CASCADE;

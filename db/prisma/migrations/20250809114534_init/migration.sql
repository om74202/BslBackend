-- DropForeignKey
ALTER TABLE "PlannedBreak" DROP CONSTRAINT "PlannedBreak_ShiftId_fkey";

-- AddForeignKey
ALTER TABLE "PlannedBreak" ADD CONSTRAINT "PlannedBreak_ShiftId_fkey" FOREIGN KEY ("ShiftId") REFERENCES "ShiftTimings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('Active', 'Inactive', 'Maintenance');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SuperAdmin', 'Admin', 'SuperUser', 'CheckSheetUser', 'User', 'Maruti_Bsl');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Pending', 'Approved', 'Reject');

-- CreateEnum
CREATE TYPE "TorqueGunStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "TypeOfBreak" AS ENUM ('Construction', 'Maintenance');

-- CreateEnum
CREATE TYPE "lineType" AS ENUM ('mainLine', 'subAssemblyLine');

-- CreateTable
CREATE TABLE "ChecksheetTable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tableData" JSONB NOT NULL,
    "cellProperties" JSONB NOT NULL,
    "cellStyles" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChecksheetTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomShiftsTimings" (
    "id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,

    CONSTRAINT "CustomShiftsTimings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "status" "DeviceStatus" NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drive" (
    "driveId" TEXT NOT NULL,
    "driveName" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "currentMaxLimit" INTEGER NOT NULL,
    "currentMinLimit" INTEGER NOT NULL,
    "voltageMaxLimit" INTEGER NOT NULL,
    "voltageMinLimit" INTEGER NOT NULL,
    "frequencyMaxLimit" INTEGER NOT NULL,
    "frequencyMinLimit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Drive_pkey" PRIMARY KEY ("driveId")
);

-- CreateTable
CREATE TABLE "Line" (
    "organizationId" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "lineName" TEXT NOT NULL,
    "noOfCustomShifts" INTEGER NOT NULL,
    "noOfShifts" INTEGER NOT NULL,
    "noOfStations" INTEGER NOT NULL,
    "lineType" "lineType" NOT NULL DEFAULT 'mainLine',
    "status" "Status" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Line_pkey" PRIMARY KEY ("lineId")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "imageUrl" TEXT,
    "unit" TEXT NOT NULL,
    "Department" TEXT NOT NULL,
    "Desingation" TEXT NOT NULL,
    "shiftCount" INTEGER NOT NULL,
    "influxOrgID" TEXT,
    "influxToken" TEXT,
    "status" "Status" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedBreak" (
    "id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "ShiftId" TEXT NOT NULL,
    "typeOfBreak" "TypeOfBreak" NOT NULL,

    CONSTRAINT "PlannedBreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedBreakCustom" (
    "id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "typeOfBreak" TEXT NOT NULL,
    "customShiftTimingId" TEXT NOT NULL,

    CONSTRAINT "PlannedBreakCustom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftTimings" (
    "id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "ShiftTimings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "Pokayoke" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cellProperties" JSONB NOT NULL,
    "cellStyles" JSONB NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "tableData" JSONB NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'Pending',
    "comment" TEXT,
    "line" TEXT,
    "location" TEXT,
    "shift" TEXT,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TorqueGun" (
    "torqueGunId" TEXT NOT NULL,
    "torqueGunName" TEXT NOT NULL,
    "torqueGunStatus" "TorqueGunStatus" NOT NULL DEFAULT 'Active',
    "torqueGunMaxLimit" INTEGER NOT NULL,
    "torqueGunMinLimit" INTEGER NOT NULL,
    "torqueGunMaxAngle" INTEGER NOT NULL,
    "torqueGunMinAngle" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stationId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Active',

    CONSTRAINT "TorqueGun_pkey" PRIMARY KEY ("torqueGunId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT,
    "phoneNumber" TEXT,
    "lastLogin" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,
    "uploadImageUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LineShift" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LineShift_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserLine" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserLine_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Drive_driveName_organizationId_key" ON "Drive"("driveName" ASC, "organizationId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Line_lineName_organizationId_key" ON "Line"("lineName" ASC, "organizationId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_email_key" ON "Organization"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Station_name_key" ON "Station"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "TorqueGun_torqueGunName_stationId_key" ON "TorqueGun"("torqueGunName" ASC, "stationId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email" ASC);

-- CreateIndex
CREATE INDEX "_LineShift_B_index" ON "_LineShift"("B" ASC);

-- CreateIndex
CREATE INDEX "_UserLine_B_index" ON "_UserLine"("B" ASC);

-- AddForeignKey
ALTER TABLE "ChecksheetTable" ADD CONSTRAINT "ChecksheetTable_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecksheetTable" ADD CONSTRAINT "ChecksheetTable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomShiftsTimings" ADD CONSTRAINT "CustomShiftsTimings_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drive" ADD CONSTRAINT "Drive_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedBreak" ADD CONSTRAINT "PlannedBreak_ShiftId_fkey" FOREIGN KEY ("ShiftId") REFERENCES "ShiftTimings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedBreakCustom" ADD CONSTRAINT "PlannedBreakCustom_customShiftTimingId_fkey" FOREIGN KEY ("customShiftTimingId") REFERENCES "CustomShiftsTimings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftTimings" ADD CONSTRAINT "ShiftTimings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TorqueGun" ADD CONSTRAINT "TorqueGun_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineShift" ADD CONSTRAINT "_LineShift_A_fkey" FOREIGN KEY ("A") REFERENCES "Line"("lineId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LineShift" ADD CONSTRAINT "_LineShift_B_fkey" FOREIGN KEY ("B") REFERENCES "ShiftTimings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLine" ADD CONSTRAINT "_UserLine_A_fkey" FOREIGN KEY ("A") REFERENCES "Line"("lineId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLine" ADD CONSTRAINT "_UserLine_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


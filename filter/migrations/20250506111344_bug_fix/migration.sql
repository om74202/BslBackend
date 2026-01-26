-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SuperAdmin', 'Admin', 'SuperUser', 'CheckSheetUser', 'User');

-- CreateEnum
CREATE TYPE "TypeOfBreak" AS ENUM ('Construction', 'Maintenance');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "imageUrl" TEXT,
    "shiftNumber" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "Department" TEXT NOT NULL,
    "Desingation" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomShift" (
    "id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,

    CONSTRAINT "CustomShift_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "PlannedBreak" (
    "id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "type" "TypeOfBreak" NOT NULL,
    "ShiftId" TEXT NOT NULL,

    CONSTRAINT "PlannedBreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "line" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isCritical" BOOLEAN NOT NULL DEFAULT false,
    "lineId" TEXT NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
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
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ShiftToline" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ShiftToline_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_email_key" ON "Organization"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_ShiftToline_B_index" ON "_ShiftToline"("B");

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomShift" ADD CONSTRAINT "CustomShift_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedBreakCustom" ADD CONSTRAINT "PlannedBreakCustom_customShiftTimingId_fkey" FOREIGN KEY ("customShiftTimingId") REFERENCES "CustomShift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedBreak" ADD CONSTRAINT "PlannedBreak_ShiftId_fkey" FOREIGN KEY ("ShiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "line"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftToline" ADD CONSTRAINT "_ShiftToline_A_fkey" FOREIGN KEY ("A") REFERENCES "Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftToline" ADD CONSTRAINT "_ShiftToline_B_fkey" FOREIGN KEY ("B") REFERENCES "line"("id") ON DELETE CASCADE ON UPDATE CASCADE;

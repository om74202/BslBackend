/*
  Warnings:

  - A unique constraint covering the columns `[lineName,organizationId]` on the table `Line` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TorqueGunStatus" AS ENUM ('Active', 'Inactive');

-- AlterTable
ALTER TABLE "Station" ADD COLUMN     "subAssemblyId" TEXT;

-- CreateTable
CREATE TABLE "SubAssembly" (
    "subAssemblyId" TEXT NOT NULL,
    "subAssemblyName" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,

    CONSTRAINT "SubAssembly_pkey" PRIMARY KEY ("subAssemblyId")
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

    CONSTRAINT "TorqueGun_pkey" PRIMARY KEY ("torqueGunId")
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

    CONSTRAINT "Drive_pkey" PRIMARY KEY ("driveId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubAssembly_subAssemblyName_lineId_key" ON "SubAssembly"("subAssemblyName", "lineId");

-- CreateIndex
CREATE UNIQUE INDEX "TorqueGun_torqueGunName_stationId_key" ON "TorqueGun"("torqueGunName", "stationId");

-- CreateIndex
CREATE UNIQUE INDEX "Drive_driveName_organizationId_key" ON "Drive"("driveName", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Line_lineName_organizationId_key" ON "Line"("lineName", "organizationId");

-- AddForeignKey
ALTER TABLE "SubAssembly" ADD CONSTRAINT "SubAssembly_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("lineId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_subAssemblyId_fkey" FOREIGN KEY ("subAssemblyId") REFERENCES "SubAssembly"("subAssemblyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TorqueGun" ADD CONSTRAINT "TorqueGun_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drive" ADD CONSTRAINT "Drive_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

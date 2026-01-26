-- CreateEnum
CREATE TYPE "TruckStatus" AS ENUM ('Running', 'Stopped', 'Maintenance');

-- CreateTable
CREATE TABLE "Trucks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "TruckStatus" NOT NULL DEFAULT 'Stopped',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "plateNumber" TEXT NOT NULL,
    "gpsDeviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trucks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GpsDevice" (
    "id" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "imeiNumber" TEXT NOT NULL,
    "simNumber" TEXT NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GpsDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trucks_name_key" ON "Trucks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GpsDevice_deviceName_key" ON "GpsDevice"("deviceName");

-- CreateIndex
CREATE UNIQUE INDEX "GpsDevice_imeiNumber_key" ON "GpsDevice"("imeiNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GpsDevice_simNumber_key" ON "GpsDevice"("simNumber");

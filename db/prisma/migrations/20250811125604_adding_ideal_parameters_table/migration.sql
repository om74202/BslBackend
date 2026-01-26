-- CreateEnum
CREATE TYPE "ProductionParamType" AS ENUM ('JPH', 'Quality');

-- CreateTable
CREATE TABLE "IdealParameters" (
    "id" TEXT NOT NULL,
    "type" "ProductionParamType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" TEXT NOT NULL,
    "lineName" TEXT NOT NULL,

    CONSTRAINT "IdealParameters_pkey" PRIMARY KEY ("id")
);

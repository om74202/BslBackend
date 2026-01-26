-- CreateTable
CREATE TABLE "DowntimeReasons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "options" TEXT[],

    CONSTRAINT "DowntimeReasons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DowntimeReasons_name_key" ON "DowntimeReasons"("name");

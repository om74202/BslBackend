-- CreateTable
CREATE TABLE "tracking_events" (
    "id" BIGSERIAL NOT NULL,
    "ts" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "route" TEXT,
    "page_name" TEXT,
    "element_id" TEXT,
    "element_text" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "tracking_events_pkey" PRIMARY KEY ("id")
);

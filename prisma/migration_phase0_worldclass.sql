-- Phase 0–4 schema extensions for Silver Note world-class platform
-- Apply via Supabase SQL Editor if `prisma db push` is unavailable.

-- CareCenter
ALTER TABLE "CareCenter" ADD COLUMN IF NOT EXISTS "homepageSlug" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "CareCenter_homepageSlug_key" ON "CareCenter"("homepageSlug");

-- User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pinHash" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "staffMode" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "fontScale" INTEGER NOT NULL DEFAULT 1;

-- Resident
DO $$ BEGIN
  CREATE TYPE "MoodChip" AS ENUM ('GOOD', 'OK', 'CAUTION');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE "Resident" ADD COLUMN IF NOT EXISTS "statusChip" "MoodChip" NOT NULL DEFAULT 'OK';

-- ResidentFamily
DO $$ BEGIN
  CREATE TYPE "FamilyRole" AS ENUM ('PRIMARY', 'VIEWER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE "ResidentFamily" ADD COLUMN IF NOT EXISTS "familyRole" "FamilyRole" NOT NULL DEFAULT 'VIEWER';
ALTER TABLE "ResidentFamily" ADD COLUMN IF NOT EXISTS "approvedById" TEXT;
ALTER TABLE "ResidentFamily" ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP(3);

-- NotificationType extensions (Postgres enum)
DO $$ BEGIN ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'Announcement'; EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'DailyReport'; EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'VisitRequest'; EXCEPTION WHEN others THEN null; END $$;
DO $$ BEGIN ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'SupplyRequest'; EXCEPTION WHEN others THEN null; END $$;

-- MedicalRecord plain language
ALTER TABLE "MedicalRecord" ADD COLUMN IF NOT EXISTS "plainExplain" TEXT;

DO $$ BEGIN
  CREATE TYPE "RequestStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "EmergencyContact" (
  "id" TEXT PRIMARY KEY,
  "residentId" TEXT NOT NULL REFERENCES "Resident"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "relation" TEXT,
  "priority" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "EmergencyContact_residentId_idx" ON "EmergencyContact"("residentId");

CREATE TABLE IF NOT EXISTS "DailyReport" (
  "id" TEXT PRIMARY KEY,
  "content" TEXT,
  "images" TEXT,
  "moodChip" "MoodChip" NOT NULL DEFAULT 'OK',
  "chips" TEXT,
  "isDraft" BOOLEAN NOT NULL DEFAULT false,
  "scheduledAt" TIMESTAMP(3),
  "publishedAt" TIMESTAMP(3),
  "readAt" TIMESTAMP(3),
  "kakaoSentAt" TIMESTAMP(3),
  "magicToken" TEXT UNIQUE,
  "careCenterId" TEXT NOT NULL REFERENCES "CareCenter"("id"),
  "residentId" TEXT NOT NULL REFERENCES "Resident"("id"),
  "authorId" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "DailyReport_careCenterId_idx" ON "DailyReport"("careCenterId");
CREATE INDEX IF NOT EXISTS "DailyReport_residentId_idx" ON "DailyReport"("residentId");
CREATE INDEX IF NOT EXISTS "DailyReport_authorId_idx" ON "DailyReport"("authorId");
CREATE INDEX IF NOT EXISTS "DailyReport_publishedAt_idx" ON "DailyReport"("publishedAt");

CREATE TABLE IF NOT EXISTS "ReportReaction" (
  "id" TEXT PRIMARY KEY,
  "type" TEXT NOT NULL,
  "note" TEXT,
  "reportId" TEXT NOT NULL REFERENCES "DailyReport"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("reportId", "userId", "type")
);
CREATE INDEX IF NOT EXISTS "ReportReaction_reportId_idx" ON "ReportReaction"("reportId");

CREATE TABLE IF NOT EXISTS "MenuPlan" (
  "id" TEXT PRIMARY KEY,
  "date" DATE NOT NULL,
  "breakfast" TEXT,
  "lunch" TEXT,
  "dinner" TEXT,
  "snack" TEXT,
  "careCenterId" TEXT NOT NULL REFERENCES "CareCenter"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("careCenterId", "date")
);
CREATE INDEX IF NOT EXISTS "MenuPlan_careCenterId_idx" ON "MenuPlan"("careCenterId");

CREATE TABLE IF NOT EXISTS "Announcement" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "images" TEXT,
  "isUrgent" BOOLEAN NOT NULL DEFAULT false,
  "careCenterId" TEXT NOT NULL REFERENCES "CareCenter"("id"),
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Announcement_careCenterId_idx" ON "Announcement"("careCenterId");

CREATE TABLE IF NOT EXISTS "VisitRequest" (
  "id" TEXT PRIMARY KEY,
  "status" "RequestStatus" NOT NULL DEFAULT 'Pending',
  "visitAt" TIMESTAMP(3) NOT NULL,
  "visitors" TEXT,
  "notes" TEXT,
  "residentId" TEXT NOT NULL REFERENCES "Resident"("id"),
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "VisitRequest_residentId_idx" ON "VisitRequest"("residentId");
CREATE INDEX IF NOT EXISTS "VisitRequest_userId_idx" ON "VisitRequest"("userId");

CREATE TABLE IF NOT EXISTS "SupplyRequest" (
  "id" TEXT PRIMARY KEY,
  "status" "RequestStatus" NOT NULL DEFAULT 'Pending',
  "itemName" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "notes" TEXT,
  "residentId" TEXT NOT NULL REFERENCES "Resident"("id"),
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "SupplyRequest_residentId_idx" ON "SupplyRequest"("residentId");
CREATE INDEX IF NOT EXISTS "SupplyRequest_userId_idx" ON "SupplyRequest"("userId");

CREATE TABLE IF NOT EXISTS "HandoverNote" (
  "id" TEXT PRIMARY KEY,
  "content" TEXT NOT NULL,
  "shift" TEXT,
  "careCenterId" TEXT NOT NULL REFERENCES "CareCenter"("id"),
  "authorId" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "HandoverNote_careCenterId_idx" ON "HandoverNote"("careCenterId");

CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "action" TEXT NOT NULL,
  "entityType" TEXT,
  "entityId" TEXT,
  "meta" TEXT,
  "careCenterId" TEXT REFERENCES "CareCenter"("id"),
  "userId" TEXT REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "AuditLog_careCenterId_idx" ON "AuditLog"("careCenterId");
CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

CREATE TABLE IF NOT EXISTS "CarePlan" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "careCenterId" TEXT NOT NULL REFERENCES "CareCenter"("id"),
  "residentId" TEXT NOT NULL REFERENCES "Resident"("id"),
  "authorId" TEXT NOT NULL REFERENCES "User"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "CarePlan_residentId_idx" ON "CarePlan"("residentId");

CREATE TABLE IF NOT EXISTS "MedicationSchedule" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "dosage" TEXT,
  "schedule" TEXT,
  "notes" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "residentId" TEXT NOT NULL REFERENCES "Resident"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "MedicationSchedule_residentId_idx" ON "MedicationSchedule"("residentId");

CREATE TABLE IF NOT EXISTS "MedicationLog" (
  "id" TEXT PRIMARY KEY,
  "administered" BOOLEAN NOT NULL DEFAULT true,
  "note" TEXT,
  "scheduleId" TEXT NOT NULL REFERENCES "MedicationSchedule"("id") ON DELETE CASCADE,
  "givenById" TEXT NOT NULL REFERENCES "User"("id"),
  "givenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "MedicationLog_scheduleId_idx" ON "MedicationLog"("scheduleId");

CREATE TABLE IF NOT EXISTS "VitalSign" (
  "id" TEXT PRIMARY KEY,
  "type" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "unit" TEXT,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "residentId" TEXT NOT NULL REFERENCES "Resident"("id")
);
CREATE INDEX IF NOT EXISTS "VitalSign_residentId_idx" ON "VitalSign"("residentId");
CREATE INDEX IF NOT EXISTS "VitalSign_recordedAt_idx" ON "VitalSign"("recordedAt");

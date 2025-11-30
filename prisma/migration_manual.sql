-- 수동 마이그레이션 SQL 스크립트
-- 프로덕션 환경이나 Prisma CLI를 사용할 수 없는 경우 사용

-- 1. ResidentFamily 테이블 생성
CREATE TABLE IF NOT EXISTS "ResidentFamily" (
    "id" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResidentFamily_pkey" PRIMARY KEY ("id")
);

-- 2. NotificationType enum 생성
CREATE TYPE "NotificationType" AS ENUM (
    'PostCreated',
    'CommentCreated',
    'MedicalRecordCreated',
    'OrderCreated',
    'OrderStatusChanged',
    'FamilyRequest',
    'FamilyApproved',
    'FamilyRejected',
    'Other'
);

-- 3. Notification 테이블 생성
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "userId" TEXT NOT NULL,
    "relatedId" TEXT,
    "relatedType" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- 4. 외래 키 제약 조건 추가
ALTER TABLE "ResidentFamily" ADD CONSTRAINT "ResidentFamily_residentId_fkey" 
    FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ResidentFamily" ADD CONSTRAINT "ResidentFamily_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. Unique 제약 조건
CREATE UNIQUE INDEX IF NOT EXISTS "ResidentFamily_residentId_userId_key" 
    ON "ResidentFamily"("residentId", "userId");

-- 6. 인덱스 생성
CREATE INDEX IF NOT EXISTS "ResidentFamily_residentId_idx" 
    ON "ResidentFamily"("residentId");

CREATE INDEX IF NOT EXISTS "ResidentFamily_userId_idx" 
    ON "ResidentFamily"("userId");

CREATE INDEX IF NOT EXISTS "ResidentFamily_isApproved_idx" 
    ON "ResidentFamily"("isApproved");

CREATE INDEX IF NOT EXISTS "Notification_userId_idx" 
    ON "Notification"("userId");

CREATE INDEX IF NOT EXISTS "Notification_isRead_idx" 
    ON "Notification"("isRead");

CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" 
    ON "Notification"("createdAt");

-- 마이그레이션 완료 메시지
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
END $$;


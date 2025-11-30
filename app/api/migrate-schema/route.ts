import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Prisma를 사용한 프로그래밍 방식 마이그레이션
export async function POST(req: Request) {
  try {
    // 보안: 프로덕션에서는 환경 변수로 제어
    if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_MIGRATE) {
      return NextResponse.json(
        { 
          error: "프로덕션 환경에서는 마이그레이션을 직접 실행할 수 없습니다.",
          hint: "Vercel에서 배포 시 자동으로 실행되거나, ALLOW_MIGRATE 환경 변수를 설정하세요."
        },
        { status: 403 }
      )
    }

    // Prisma Client를 통해 스키마 정보 확인 및 테이블 생성
    // 직접 SQL 실행 방식 사용
    
    const results: any = {
      steps: [],
      errors: [],
      success: true,
    }

    try {
      // 1. NotificationType enum 확인 및 생성
      try {
        await prisma.$executeRawUnsafe(`
          DO $$ BEGIN
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
          EXCEPTION
            WHEN duplicate_object THEN null;
          END $$;
        `)
        results.steps.push("✓ NotificationType enum 확인 완료")
      } catch (error: any) {
        if (!error.message?.includes('already exists')) {
          results.errors.push(`NotificationType enum: ${error.message}`)
        } else {
          results.steps.push("✓ NotificationType enum 이미 존재")
        }
      }

      // 2. ResidentFamily 테이블 생성
      try {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "ResidentFamily" (
            "id" TEXT NOT NULL,
            "residentId" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "relationship" TEXT NOT NULL,
            "isApproved" BOOLEAN NOT NULL DEFAULT false,
            "approvedById" TEXT,
            "approvedAt" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "ResidentFamily_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "ResidentFamily_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "ResidentFamily_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `)
        results.steps.push("✓ ResidentFamily 테이블 생성 완료")
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          results.steps.push("✓ ResidentFamily 테이블 이미 존재")
        } else {
          results.errors.push(`ResidentFamily 테이블: ${error.message}`)
          results.success = false
        }
      }

      // 3. Notification 테이블 생성
      try {
        await prisma.$executeRawUnsafe(`
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
            CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
          );
        `)
        results.steps.push("✓ Notification 테이블 생성 완료")
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          results.steps.push("✓ Notification 테이블 이미 존재")
        } else {
          results.errors.push(`Notification 테이블: ${error.message}`)
          results.success = false
        }
      }

      // 4. 인덱스 생성 (IF NOT EXISTS는 PostgreSQL에서 직접 지원하지 않으므로 try-catch)
      const indexes = [
        { name: "ResidentFamily_residentId_userId_key", sql: `CREATE UNIQUE INDEX IF NOT EXISTS "ResidentFamily_residentId_userId_key" ON "ResidentFamily"("residentId", "userId");` },
        { name: "ResidentFamily_residentId_idx", sql: `CREATE INDEX IF NOT EXISTS "ResidentFamily_residentId_idx" ON "ResidentFamily"("residentId");` },
        { name: "ResidentFamily_userId_idx", sql: `CREATE INDEX IF NOT EXISTS "ResidentFamily_userId_idx" ON "ResidentFamily"("userId");` },
        { name: "ResidentFamily_isApproved_idx", sql: `CREATE INDEX IF NOT EXISTS "ResidentFamily_isApproved_idx" ON "ResidentFamily"("isApproved");` },
        { name: "Notification_userId_idx", sql: `CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");` },
        { name: "Notification_isRead_idx", sql: `CREATE INDEX IF NOT EXISTS "Notification_isRead_idx" ON "Notification"("isRead");` },
        { name: "Notification_createdAt_idx", sql: `CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" ON "Notification"("createdAt");` },
      ]

      for (const index of indexes) {
        try {
          await prisma.$executeRawUnsafe(index.sql)
          results.steps.push(`✓ 인덱스 생성 완료: ${index.name}`)
        } catch (error: any) {
          if (!error.message?.includes('already exists')) {
            results.steps.push(`⚠ 인덱스 ${index.name}: ${error.message}`)
          }
        }
      }

      // 5. Prisma 클라이언트 재생성 (스키마 변경 반영)
      // 이 부분은 서버에서 직접 실행할 수 없으므로, 배포 후에 자동으로 실행되도록 함

    } catch (error: any) {
      results.errors.push(`전체 오류: ${error.message}`)
      results.success = false
    }

    if (results.errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "일부 마이그레이션이 실패했습니다.",
          steps: results.steps,
          errors: results.errors,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "마이그레이션이 성공적으로 완료되었습니다.",
      steps: results.steps,
      note: "Prisma 클라이언트를 재생성하려면 배포하거나 'npm run db:generate'를 실행하세요.",
    })
  } catch (error: any) {
    console.error("Migration error:", error)
    return NextResponse.json(
      {
        error: "마이그레이션 실행 중 오류가 발생했습니다.",
        details: error.message,
      },
      { status: 500 }
    )
  }
}

// GET으로 마이그레이션 상태 확인
export async function GET() {
  try {
    // 테이블 존재 여부 확인
    const tables = await prisma.$queryRawUnsafe<Array<{ table_name: string }>>(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('ResidentFamily', 'Notification')
      ORDER BY table_name;
    `)

    const tableNames = tables.map(t => t.table_name)

    return NextResponse.json({
      message: "마이그레이션 상태 확인",
      tables: {
        ResidentFamily: tableNames.includes('ResidentFamily'),
        Notification: tableNames.includes('Notification'),
      },
      allTablesExist: tableNames.length === 2,
      note: "POST 요청으로 마이그레이션을 실행할 수 있습니다.",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "상태 확인 중 오류가 발생했습니다.",
        details: error.message,
      },
      { status: 500 }
    )
  }
}


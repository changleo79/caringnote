@echo off
echo ========================================
echo 데이터베이스 마이그레이션 시작
echo ========================================
echo.

echo [1/2] Prisma 클라이언트 생성 중...
call npm run db:generate
if %ERRORLEVEL% NEQ 0 (
    echo 오류: Prisma 클라이언트 생성 실패
    pause
    exit /b 1
)
echo ✓ Prisma 클라이언트 생성 완료
echo.

echo [2/2] 데이터베이스 스키마 적용 중...
call npm run db:push
if %ERRORLEVEL% NEQ 0 (
    echo 오류: 데이터베이스 스키마 적용 실패
    pause
    exit /b 1
)
echo ✓ 데이터베이스 스키마 적용 완료
echo.

echo ========================================
echo 마이그레이션 완료!
echo ========================================
echo.
echo 다음 단계:
echo 1. 개발 서버 재시작: npm run dev
echo 2. 새 기능 테스트
echo.
pause


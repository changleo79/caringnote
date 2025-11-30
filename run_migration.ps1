Write-Host "========================================" -ForegroundColor Cyan
Write-Host "데이터베이스 마이그레이션 시작" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Prisma 클라이언트 생성 중..." -ForegroundColor Yellow
npm run db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "오류: Prisma 클라이언트 생성 실패" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Prisma 클라이언트 생성 완료" -ForegroundColor Green
Write-Host ""

Write-Host "[2/2] 데이터베이스 스키마 적용 중..." -ForegroundColor Yellow
npm run db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "오류: 데이터베이스 스키마 적용 실패" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ 데이터베이스 스키마 적용 완료" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "마이그레이션 완료!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Yellow
Write-Host "1. 개발 서버 재시작: npm run dev"
Write-Host "2. 새 기능 테스트"
Write-Host ""
Read-Host "Press Enter to exit"


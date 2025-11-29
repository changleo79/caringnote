# 자동 배포 스크립트 (PowerShell)
# 사용자 확인 없이 자동으로 Git 커밋, 푸시, 재배포

param(
    [Parameter(Mandatory=$false)]
    [string]$Message = "자동 배포: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "🚀 자동 배포를 시작합니다...`n" -ForegroundColor Cyan

# 1. 변경사항 확인
Write-Host "📝 변경사항 확인 중..." -ForegroundColor Yellow
$status = git status --short
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "⚠️  변경사항이 없습니다. 배포를 건너뜁니다." -ForegroundColor Yellow
    exit 0
}

Write-Host "변경된 파일:" -ForegroundColor Gray
git status --short

# 2. 모든 파일 추가
Write-Host "`n📦 변경사항 스테이징 중..." -ForegroundColor Yellow
git add .

# 3. 커밋
Write-Host "💾 커밋 생성 중..." -ForegroundColor Yellow
git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 커밋 실패" -ForegroundColor Red
    exit 1
}

# 4. 푸시
Write-Host "📤 GitHub에 푸시 중..." -ForegroundColor Yellow
git push
if ($LASTEXITCODE -ne 0) {
    # 업스트림 설정 시도
    Write-Host "업스트림 브랜치 설정 중..." -ForegroundColor Yellow
    git push --set-upstream origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 푸시 실패" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n✅ 배포 완료!" -ForegroundColor Green
Write-Host "Vercel이 자동으로 재배포를 시작합니다..." -ForegroundColor Cyan
Write-Host "대시보드: https://vercel.com/dashboard`n" -ForegroundColor Gray


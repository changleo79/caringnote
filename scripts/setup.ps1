# 요양원 케어 플랫폼 프로젝트 초기 설정 스크립트 (PowerShell)

Write-Host "🚀 요양원 케어 플랫폼 프로젝트 설정을 시작합니다..." -ForegroundColor Cyan

# 1. 의존성 설치
Write-Host "`n📦 의존성 패키지를 설치합니다..." -ForegroundColor Yellow
npm install

# 2. 환경 변수 파일 생성
if (-not (Test-Path .env.local)) {
    Write-Host "`n⚙️  환경 변수 파일을 생성합니다..." -ForegroundColor Yellow
    Copy-Item .env.local.example .env.local
    Write-Host "✅ .env.local 파일이 생성되었습니다. 필요한 값을 설정해주세요." -ForegroundColor Green
} else {
    Write-Host "`n⚠️  .env.local 파일이 이미 존재합니다." -ForegroundColor Yellow
}

# 3. Prisma 클라이언트 생성
Write-Host "`n🗄️  Prisma 클라이언트를 생성합니다..." -ForegroundColor Yellow
npm run db:generate

# 4. 데이터베이스 초기화
Write-Host "`n🗄️  데이터베이스를 초기화합니다..." -ForegroundColor Yellow
npm run db:push

Write-Host "`n✅ 설정이 완료되었습니다!`n" -ForegroundColor Green
Write-Host "다음 단계:" -ForegroundColor Cyan
Write-Host "1. .env.local 파일을 편집하여 환경 변수를 설정하세요"
Write-Host "2. npm run dev 명령으로 개발 서버를 실행하세요`n"


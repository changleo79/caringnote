# GitHub 저장소 초기화 스크립트 (PowerShell)

param(
    [Parameter(Mandatory=$false)]
    [string]$GitHubUsername = "",
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "care-app"
)

Write-Host "🚀 GitHub 저장소 초기화를 시작합니다...`n" -ForegroundColor Cyan

# 1. Git 초기화 확인
if (Test-Path .git) {
    Write-Host "⚠️  Git이 이미 초기화되어 있습니다." -ForegroundColor Yellow
    $continue = Read-Host "계속하시겠습니까? (y/n)"
    if ($continue -ne "y") {
        exit
    }
} else {
    Write-Host "📦 Git 저장소를 초기화합니다..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Git 초기화 실패" -ForegroundColor Red
        exit 1
    }
}

# 2. 파일 추가
Write-Host "`n📝 파일을 추가합니다..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 파일 추가 실패" -ForegroundColor Red
    exit 1
}

# 3. 첫 커밋
Write-Host "`n💾 첫 커밋을 생성합니다..." -ForegroundColor Yellow
git commit -m "Initial commit: 요양원 케어 플랫폼 프로젝트 시작"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 커밋 실패" -ForegroundColor Red
    exit 1
}

# 4. GitHub 사용자명 확인
if ([string]::IsNullOrWhiteSpace($GitHubUsername)) {
    Write-Host "`n📋 GitHub 사용자명을 입력하세요:" -ForegroundColor Cyan
    $GitHubUsername = Read-Host
}

if ([string]::IsNullOrWhiteSpace($GitHubUsername)) {
    Write-Host "❌ GitHub 사용자명이 필요합니다." -ForegroundColor Red
    Write-Host "`n다음 명령어로 나중에 원격 저장소를 추가할 수 있습니다:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/YOUR_USERNAME/$RepoName.git" -ForegroundColor Gray
    Write-Host "git branch -M main" -ForegroundColor Gray
    Write-Host "git push -u origin main" -ForegroundColor Gray
    exit 0
}

# 5. 원격 저장소 추가
$remoteUrl = "https://github.com/$GitHubUsername/$RepoName.git"
Write-Host "`n🔗 원격 저장소를 추가합니다: $remoteUrl" -ForegroundColor Yellow

# 기존 원격 저장소 확인
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "⚠️  원격 저장소가 이미 설정되어 있습니다: $existingRemote" -ForegroundColor Yellow
    $replace = Read-Host "교체하시겠습니까? (y/n)"
    if ($replace -eq "y") {
        git remote set-url origin $remoteUrl
    } else {
        Write-Host "기존 원격 저장소를 유지합니다." -ForegroundColor Gray
    }
} else {
    git remote add origin $remoteUrl
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 원격 저장소 추가 실패" -ForegroundColor Red
        exit 1
    }
}

# 6. 브랜치 이름 변경
Write-Host "`n🌿 브랜치를 'main'으로 설정합니다..." -ForegroundColor Yellow
git branch -M main

Write-Host "`n✅ Git 초기화가 완료되었습니다!`n" -ForegroundColor Green

# 7. GitHub에 푸시 여부 확인
Write-Host "다음 단계:" -ForegroundColor Cyan
Write-Host "1. GitHub에서 저장소를 먼저 생성하세요: https://github.com/new" -ForegroundColor White
Write-Host "2. 저장소 이름: $RepoName" -ForegroundColor White
Write-Host "3. 'Initialize this repository with a README'는 체크하지 마세요`n" -ForegroundColor White

$pushNow = Read-Host "지금 GitHub에 푸시하시겠습니까? (y/n)"
if ($pushNow -eq "y") {
    Write-Host "`n📤 GitHub에 푸시합니다..." -ForegroundColor Yellow
    git push -u origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ 푸시가 완료되었습니다!" -ForegroundColor Green
        Write-Host "저장소: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor Cyan
    } else {
        Write-Host "`n⚠️  푸시 실패. 다음 명령어로 나중에 푸시할 수 있습니다:" -ForegroundColor Yellow
        Write-Host "git push -u origin main" -ForegroundColor Gray
    }
} else {
    Write-Host "`n나중에 다음 명령어로 푸시할 수 있습니다:" -ForegroundColor Yellow
    Write-Host "git push -u origin main" -ForegroundColor Gray
}

Write-Host "`n📚 더 자세한 정보: GITHUB_SETUP.md 파일을 참조하세요.`n" -ForegroundColor Cyan


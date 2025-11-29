#!/bin/bash
# 자동 배포 스크립트 (Bash)
# 사용자 확인 없이 자동으로 Git 커밋, 푸시, 재배포

MESSAGE=${1:-"자동 배포: $(date '+%Y-%m-%d %H:%M:%S')"}

echo "🚀 자동 배포를 시작합니다..."
echo ""

# 1. 변경사항 확인
echo "📝 변경사항 확인 중..."
if [ -z "$(git status --short)" ]; then
    echo "⚠️  변경사항이 없습니다. 배포를 건너뜁니다."
    exit 0
fi

echo "변경된 파일:"
git status --short

# 2. 모든 파일 추가
echo ""
echo "📦 변경사항 스테이징 중..."
git add .

# 3. 커밋
echo "💾 커밋 생성 중..."
git commit -m "$MESSAGE"
if [ $? -ne 0 ]; then
    echo "❌ 커밋 실패"
    exit 1
fi

# 4. 푸시
echo "📤 GitHub에 푸시 중..."
git push
if [ $? -ne 0 ]; then
    # 업스트림 설정 시도
    echo "업스트림 브랜치 설정 중..."
    git push --set-upstream origin main
    if [ $? -ne 0 ]; then
        echo "❌ 푸시 실패"
        exit 1
    fi
fi

echo ""
echo "✅ 배포 완료!"
echo "Vercel이 자동으로 재배포를 시작합니다..."
echo "대시보드: https://vercel.com/dashboard"
echo ""


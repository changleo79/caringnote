#!/bin/bash

# 요양원 케어 플랫폼 프로젝트 초기 설정 스크립트

echo "🚀 요양원 케어 플랫폼 프로젝트 설정을 시작합니다..."

# 1. 의존성 설치
echo "📦 의존성 패키지를 설치합니다..."
npm install

# 2. 환경 변수 파일 생성
if [ ! -f .env.local ]; then
    echo "⚙️  환경 변수 파일을 생성합니다..."
    cp .env.local.example .env.local
    echo "✅ .env.local 파일이 생성되었습니다. 필요한 값을 설정해주세요."
else
    echo "⚠️  .env.local 파일이 이미 존재합니다."
fi

# 3. Prisma 클라이언트 생성
echo "🗄️  Prisma 클라이언트를 생성합니다..."
npm run db:generate

# 4. 데이터베이스 초기화
echo "🗄️  데이터베이스를 초기화합니다..."
npm run db:push

echo ""
echo "✅ 설정이 완료되었습니다!"
echo ""
echo "다음 단계:"
echo "1. .env.local 파일을 편집하여 환경 변수를 설정하세요"
echo "2. npm run dev 명령으로 개발 서버를 실행하세요"
echo ""


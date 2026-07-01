# 실버노트 (Silver Note)

요양원에 계신 부모님의 일상을 가족과 함께 기록하고, 건강한 생활을 지원하는 통합 소통 플랫폼입니다.

## 주요 기능

- **일상 기록** — 요양원에서 부모님의 일상 사진과 소식 공유
- **의료 정보** — 건강 상태, 진료·약물 기록 관리
- **생필품 쇼핑** — 필요한 물품을 요양원으로 직접 주문
- **실시간 알림** — 새 게시글, 댓글, 의료 기록 등 즉시 알림

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 14 (App Router), React, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Prisma ORM + Supabase PostgreSQL |
| Auth | NextAuth.js (Credentials) |
| Storage | Supabase Storage |
| Deployment | Vercel |

## 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하세요

# 3. 데이터베이스 설정
npm run db:generate
npm run db:push

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 환경 변수

`.env.local`에 다음 변수를 설정하세요:

```env
DATABASE_URL="postgresql://..."       # Supabase pooled connection (port 6543)
DIRECT_URL="postgresql://..."         # Supabase direct connection (port 5432)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

자세한 Supabase 설정은 [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)를 참조하세요.

## 프로젝트 구조

```
silver-note/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 로그인, 회원가입
│   ├── (main)/            # 대시보드, 커뮤니티, 의료, 쇼핑
│   └── api/               # API 라우트
├── components/
│   ├── brand/             # 로고, 브랜드마크
│   ├── layout/            # 앱 레이아웃
│   └── ui/                # UI 컴포넌트
├── lib/                   # 유틸리티, auth, prisma
├── prisma/                # 스키마, 시드
└── docs/                  # 설정 가이드
```

## 배포

Vercel 배포 가이드는 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)를 참조하세요.

## 라이선스

Private

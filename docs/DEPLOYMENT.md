# Vercel 배포 가이드

## 1. GitHub 연결

저장소: `changleo79/caringnote`

Vercel Dashboard → **Add New Project** → GitHub 저장소 선택

## 2. 빌드 설정

| 설정 | 값 |
|------|-----|
| Framework | Next.js |
| Build Command | `npm run build` |
| Install Command | `npm install --legacy-peer-deps` |
| Output Directory | `.next` (기본값) |
| Region | icn1 (Seoul) |

## 3. 환경 변수

Production, Preview, Development 모두 설정:

```
DATABASE_URL          # Supabase pooled (6543)
DIRECT_URL            # Supabase direct (5432)
NEXTAUTH_URL          # https://your-app.vercel.app
NEXTAUTH_SECRET       # openssl rand -base64 32
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## 4. 배포 후 확인

1. `/api/db-check` — DB 연결 확인
2. `/auth/signup` — 회원가입 테스트
3. `/auth/login` — 로그인 테스트

## 5. Vercel 프로젝트 정리

동일 저장소에 연결된 Vercel 프로젝트가 여러 개인 경우:

1. 각 프로젝트의 **Last Deployment** 날짜 확인
2. 가장 최근 배포된 프로젝트만 유지
3. 나머지는 Settings → General → Delete Project

## 6. 커스텀 도메인 (선택)

Settings → Domains → 도메인 추가 후 DNS 설정

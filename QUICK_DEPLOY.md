# 🚀 빠른 배포 가이드 - caringnote.vercel.app

## 즉시 배포하기

### 1️⃣ Vercel 웹사이트 접속
**https://vercel.com** → GitHub로 로그인

### 2️⃣ 프로젝트 Import
- "Add New..." → "Project"
- `changleo79/caringnote` 선택
- "Import" 클릭

### 3️⃣ 프로젝트 이름 설정
- Project Name: **`caringnote`**
- → URL: `https://caringnote.vercel.app`

### 4️⃣ 환경 변수 추가 (중요!)

**Environment Variables** 섹션에서:

| 변수명 | 값 | 비고 |
|--------|-----|------|
| `DATABASE_URL` | 프로덕션 DB URL | Vercel Postgres 사용 시 자동 생성 |
| `NEXTAUTH_URL` | `https://caringnote.vercel.app` | 배포 후 도메인 |
| `NEXTAUTH_SECRET` | 랜덤 문자열 | 생성 필요 |

**NEXTAUTH_SECRET 생성:**
- 온라인: https://generate-secret.vercel.app/32
- 또는 PowerShell:
  ```powershell
  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
  ```

### 5️⃣ 데이터베이스 설정

#### 옵션 A: Vercel Postgres (추천)
1. Storage 탭 → "Create Database" → Postgres
2. 생성 후 `POSTGRES_URL` 자동 추가
3. `DATABASE_URL` = `POSTGRES_URL`로 설정

#### 옵션 B: Supabase
1. https://supabase.com에서 프로젝트 생성
2. Connection String 복사
3. Vercel에 `DATABASE_URL`로 추가

### 6️⃣ Deploy!

"Deploy" 버튼 클릭 → 2-3분 대기

### 7️⃣ 데이터베이스 마이그레이션

배포 후 로컬에서:

```powershell
$env:DATABASE_URL="프로덕션-DATABASE_URL"
npx prisma db push
```

### 8️⃣ 확인!

**https://caringnote.vercel.app** 접속 확인 ✅

## 자동 배포

이제 GitHub에 푸시하면 자동으로 배포됩니다!

```powershell
git add .
git commit -m "변경 내용"
git push  # ← 자동 배포 시작!
```

## 📖 상세 가이드

- [VERCEL_WEB_DEPLOY.md](./VERCEL_WEB_DEPLOY.md) - 웹사이트 배포 상세 가이드
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Vercel 설정 전체 가이드


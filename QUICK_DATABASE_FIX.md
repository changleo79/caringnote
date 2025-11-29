# 🔧 데이터베이스 오류 즉시 해결

## 🔴 "데이터베이스 오류" 해결 방법

### 가장 빠른 해결책

**Vercel 대시보드에서 PostgreSQL 데이터베이스 생성:**

1. Vercel 프로젝트 접속: https://vercel.com/dashboard
2. 프로젝트 선택: `caringnote` 또는 `changleo79-caringnote`
3. **Storage** 탭 클릭
4. **Create Database** 버튼 클릭
5. **Postgres** 선택
6. 데이터베이스 이름 입력 (예: `caringnote-db`)
7. **Create** 클릭

### 자동 생성된 환경 변수

PostgreSQL 생성 후 다음이 자동 생성됩니다:
- `POSTGRES_URL` 
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### DATABASE_URL 설정

1. Vercel → Settings → Environment Variables
2. **Add** 클릭
3. Key: `DATABASE_URL`
4. Value: `POSTGRES_PRISMA_URL` 값과 동일하게 설정
   - 또는 `POSTGRES_URL` 사용
5. Environment: ✅ Production ✅ Preview ✅ Development
6. **Save** 클릭

### 데이터베이스 스키마 적용

환경 변수 설정 후:

**옵션 1: Vercel CLI 사용**
```powershell
# Vercel CLI 설치 (없으면)
npm i -g vercel

# 로그인
vercel login

# 환경 변수 연결
vercel link

# 데이터베이스 스키마 적용
vercel env pull
$env:DATABASE_URL="복사한_POSTGRES_PRISMA_URL"
npx prisma db push
```

**옵션 2: 수동으로**
1. Vercel에서 `POSTGRES_PRISMA_URL` 복사
2. 로컬에서:
   ```powershell
   $env:DATABASE_URL="복사한_URL"
   npx prisma db push
   ```

### 재배포

환경 변수 설정 후:
- Vercel → Deployments → 최신 배포 → **Redeploy**
- 또는 GitHub에 빈 커밋 푸시

### 회원가입 테스트

데이터베이스 설정 후:
1. 회원가입 페이지 접속
2. **요양원 직원** 선택
3. 정보 입력 후 가입
4. 성공 확인!

---

**가장 빠른 방법: Vercel Storage → Postgres 생성 → DATABASE_URL 설정 → 재배포** 🚀


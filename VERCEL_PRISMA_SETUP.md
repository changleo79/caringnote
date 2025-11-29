# 🚀 Vercel 공식 가이드 - 현재 프로젝트에 적용하기

Vercel의 공식 Prisma Postgres 가이드를 **케어링노트 프로젝트**에 맞게 적용하는 방법입니다.

---

## ✅ 현재 상태 확인

이미 완료된 것들:
- ✅ Next.js 프로젝트 생성 완료
- ✅ Prisma 설정 완료
- ✅ 데이터베이스 연결 완료 (Storage 탭에서 확인)

이제 해야 할 것들:
- 🔄 환경 변수 가져오기
- 🔄 데이터베이스 마이그레이션 실행
- 🔄 시드 데이터 생성

---

## 📋 단계별 실행 방법

### 1단계: Vercel CLI 설치 및 로그인

터미널(cursor 터미널 또는 PowerShell)에서 실행:

```bash
# Vercel CLI가 없으면 설치
npm install -g vercel

# Vercel에 로그인
vercel login
```

**실행 방법:**
- 브라우저가 자동으로 열리고 로그인하라는 창이 나타납니다
- "Authorize Vercel" 버튼 클릭
- 로그인 완료!

---

### 2단계: 프로젝트 연결

현재 프로젝트 디렉토리에서 실행:

```bash
vercel link
```

**실행 시 나타나는 질문들:**

1. **"Set up and develop"?** → `Y` (Yes) 입력하고 Enter
2. **"Which scope?"** → 본인의 계정 선택
3. **"Link to existing project?"** → `Y` (Yes) 입력
4. **"What's the name of your existing project?"** → `caringnote` 입력 (또는 프로젝트 이름)

**성공 메시지:**
```
✅ Linked to [계정명]/caringnote
```

---

### 3단계: 환경 변수 가져오기

Vercel에 설정된 환경 변수를 로컬로 가져옵니다:

```bash
vercel env pull .env.local
```

**실행 결과:**
- `.env.local` 파일이 생성되거나 업데이트됩니다
- `DATABASE_URL`, `POSTGRES_PRISMA_URL` 등이 자동으로 추가됩니다

**확인 방법:**
```bash
# .env.local 파일 확인 (Windows PowerShell)
Get-Content .env.local

# 또는 에디터에서 .env.local 파일 열기
```

---

### 4단계: Prisma 클라이언트 생성

Prisma 스키마를 기반으로 클라이언트 생성:

```bash
npx prisma generate
```

**실행 결과:**
```
✔ Generated Prisma Client
```

---

### 5단계: 데이터베이스 마이그레이션

로컬 마이그레이션 파일 생성 및 데이터베이스에 적용:

```bash
npx prisma migrate dev --name init
```

**실행 시 나타나는 질문:**
- **"Create a new migration?"** → `Y` 입력

**실행 결과:**
- `prisma/migrations/` 폴더에 마이그레이션 파일 생성
- 데이터베이스에 테이블 구조 생성

**참고:** 이미 마이그레이션이 있다면:
```bash
# 마이그레이션만 적용 (파일 생성 안 함)
npx prisma migrate deploy
```

---

### 6단계: 시드 데이터 생성

테스트용 요양원 데이터 생성:

```bash
npx prisma db seed
```

또는 package.json에 seed 스크립트가 설정되어 있다면:
```bash
npm run seed
```

**실행 결과:**
- 3개의 요양원 데이터가 생성됩니다:
  - 행복 요양원
  - 사랑 요양원
  - 평화 요양원

---

### 7단계: 배포

변경사항을 Vercel에 배포:

```bash
# 미리보기 배포
vercel

# 프로덕션 배포
vercel --prod
```

또는 GitHub에 푸시하면 자동 배포됩니다:
```bash
git add .
git commit -m "데이터베이스 마이그레이션 및 시드 데이터 추가"
git push
```

---

## 🎯 빠른 실행 순서 (한 번에)

터미널에서 순서대로 실행하세요:

```bash
# 1. Vercel CLI 설치 (한 번만)
npm install -g vercel

# 2. 로그인 (한 번만)
vercel login

# 3. 프로젝트 연결 (한 번만)
vercel link

# 4. 환경 변수 가져오기
vercel env pull .env.local

# 5. Prisma 클라이언트 생성
npx prisma generate

# 6. 마이그레이션 실행
npx prisma migrate dev --name init

# 7. 시드 데이터 생성
npx prisma db seed

# 8. 배포
vercel --prod
```

---

## 🔍 문제 해결

### "vercel: command not found"
→ Vercel CLI가 설치되지 않았습니다. `npm install -g vercel` 실행

### "Error: You are not logged in"
→ `vercel login` 실행

### "Error: This directory is not linked to a project"
→ `vercel link` 실행

### "Error: Migration failed"
→ 데이터베이스가 연결되어 있는지 확인:
  - Vercel Storage에서 데이터베이스 Status가 "Active"인지 확인
  - `.env.local` 파일에 `DATABASE_URL`이 있는지 확인

### "Error: Environment variable not found"
→ Vercel에서 환경 변수를 먼저 설정하거나, `vercel env pull` 재실행

### "Schema validation error"
→ `prisma/schema.prisma` 파일에 오류가 있을 수 있습니다. 확인 필요

---

## ✅ 완료 확인

모든 단계가 완료되었는지 확인:

```bash
# 1. 환경 변수 확인
cat .env.local | grep DATABASE_URL

# 2. Prisma Studio로 데이터베이스 확인 (선택사항)
npx prisma studio
```

**Prisma Studio 실행:**
- 브라우저가 자동으로 열립니다
- `http://localhost:5555` 접속
- CareCenter 테이블에서 요양원 데이터 확인 가능

---

## 📝 중요 사항

1. **`.env.local` 파일은 절대 Git에 커밋하지 마세요!**
   - 이미 `.gitignore`에 포함되어 있을 것입니다

2. **마이그레이션은 한 번만 실행하세요**
   - 두 번째부터는 오류가 날 수 있습니다
   - 그럴 때는 `npx prisma migrate deploy` 사용

3. **시드 데이터는 여러 번 실행해도 안전합니다**
   - 이미 있는 데이터는 건너뛰고 새로 생성합니다

---

## 🎉 완료!

이제 다음이 완료되었습니다:
- ✅ 데이터베이스 연결
- ✅ 테이블 구조 생성
- ✅ 테스트 데이터 추가

**회원가입 페이지에서 요양원 목록이 보일 것입니다!** 🚀


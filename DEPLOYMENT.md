# 배포 가이드

## GitHub 및 Vercel 배포 설정

### 1. GitHub 저장소 생성 및 초기화

```bash
# Git 초기화
git init

# .gitignore가 이미 설정되어 있습니다

# 파일 추가 및 커밋
git add .
git commit -m "Initial commit: 요양원 케어 플랫폼 프로젝트 시작"

# GitHub에 저장소를 생성한 후
git remote add origin https://github.com/YOUR_USERNAME/care-app.git
git branch -M main
git push -u origin main
```

### 2. Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 추가하세요:

```
DATABASE_URL=your_database_url
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here
```

**NEXTAUTH_SECRET 생성 방법:**
```bash
openssl rand -base64 32
```

### 4. 데이터베이스 설정

프로덕션 환경에서는 SQLite 대신 PostgreSQL 사용을 권장합니다:

1. Vercel Postgres 또는 다른 PostgreSQL 서비스 사용
2. `DATABASE_URL` 환경 변수에 PostgreSQL 연결 문자열 설정
3. Prisma 마이그레이션 실행:

```bash
npm run db:push
```

### 5. 배포 확인

배포 후 다음을 확인하세요:
- 홈페이지 접속 가능 여부
- 회원가입 및 로그인 기능
- API 엔드포인트 작동 여부

## 로컬 개발 환경

### 시작하기

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 편집

# 데이터베이스 초기화
npm run db:generate
npm run db:push

# 개발 서버 실행
npm run dev
```

### 데이터베이스 관리

```bash
# Prisma Studio 실행 (데이터베이스 GUI)
npm run db:studio

# 데이터베이스 마이그레이션
npm run db:push
```

## 주의사항

- 프로덕션에서는 반드시 강력한 `NEXTAUTH_SECRET` 사용
- 데이터베이스 백업 정기적으로 수행
- 환경 변수는 절대 커밋하지 않기
- 이미지 업로드의 경우 Vercel Blob 또는 Cloudinary 사용 권장


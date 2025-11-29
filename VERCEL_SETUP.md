# Vercel 배포 설정 가이드

## 📋 단계별 배포 방법

### 1단계: Vercel 계정 생성

1. [Vercel](https://vercel.com) 접속
2. **Sign Up** 클릭
3. **Continue with GitHub** 선택 (GitHub 계정으로 연동 권장)

### 2단계: 프로젝트 Import

1. Vercel 대시보드에서 **Add New...** → **Project** 클릭
2. GitHub 저장소 목록에서 `care-app` 선택
3. 또는 **Import Git Repository**에서 직접 URL 입력

### 3단계: 프로젝트 설정

Vercel이 자동으로 Next.js 프로젝트를 감지하지만, 다음 설정을 확인하세요:

#### 기본 설정

- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

#### 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수들을 추가하세요:

| 변수명 | 설명 | 예시 값 |
|--------|------|---------|
| `DATABASE_URL` | 프로덕션 데이터베이스 URL | `postgresql://...` |
| `NEXTAUTH_URL` | 앱 URL (배포 후 자동 생성됨) | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | NextAuth 비밀키 | `openssl rand -base64 32`로 생성 |

##### NEXTAUTH_SECRET 생성 방법

터미널에서 실행:

```bash
# Mac/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

또는 온라인 생성기 사용: https://generate-secret.vercel.app/32

### 4단계: 프로덕션 데이터베이스 설정

개발 환경에서는 SQLite를 사용하지만, 프로덕션에서는 PostgreSQL을 권장합니다.

#### 옵션 1: Vercel Postgres (권장)

1. Vercel 대시보드에서 프로젝트 선택
2. **Storage** 탭 클릭
3. **Create Database** → **Postgres** 선택
4. 데이터베이스 생성 후 자동으로 `POSTGRES_URL` 환경 변수가 추가됩니다
5. `DATABASE_URL` 환경 변수를 `POSTGRES_URL`과 동일하게 설정

#### 옵션 2: Supabase

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. **Settings** → **Database**에서 연결 문자열 복사
3. Vercel 환경 변수에 `DATABASE_URL` 추가

#### 옵션 3: PlanetScale

1. [PlanetScale](https://planetscale.com)에서 데이터베이스 생성
2. 연결 문자열 복사
3. Vercel 환경 변수에 `DATABASE_URL` 추가

### 5단계: 데이터베이스 마이그레이션

프로덕션 데이터베이스에 스키마를 적용해야 합니다.

#### 방법 1: Vercel CLI 사용 (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# Vercel 로그인
vercel login

# 프로젝트 연결
vercel link

# 환경 변수 로드
vercel env pull .env.production

# 데이터베이스 마이그레이션
npx prisma db push --schema=./prisma/schema.prisma
```

#### 방법 2: 직접 연결

```bash
# DATABASE_URL 환경 변수 설정 후
export DATABASE_URL="your-production-database-url"

# 또는 Windows PowerShell
$env:DATABASE_URL="your-production-database-url"

# 마이그레이션 실행
npx prisma db push
```

### 6단계: 배포

1. **Deploy** 버튼 클릭
2. 배포 진행 상황 확인 (약 2-3분 소요)
3. 배포 완료 후 제공되는 URL로 접속

### 7단계: 배포 후 확인

배포가 완료되면:

1. ✅ 홈페이지 접속 확인
2. ✅ 회원가입 및 로그인 테스트
3. ✅ API 엔드포인트 작동 확인
4. ✅ 데이터베이스 연결 확인

## 🔄 자동 배포 설정

GitHub와 연동하면 자동으로 배포됩니다:

- **main 브랜치에 푸시** → 프로덕션 자동 배포
- **다른 브랜치에 푸시** → Preview 배포

## 🌍 커스텀 도메인 설정

1. Vercel 프로젝트 대시보드에서 **Settings** → **Domains**
2. 도메인 추가
3. DNS 설정 안내에 따라 도메인 설정

## 🔍 배포 문제 해결

### 빌드 실패 시

1. **Build Logs** 확인
2. 환경 변수 누락 확인
3. 데이터베이스 연결 확인
4. Prisma 클라이언트 생성 확인

### 데이터베이스 연결 오류

1. `DATABASE_URL` 환경 변수 확인
2. 데이터베이스 서버 접근 가능 여부 확인
3. SSL 연결 필요 시 `?sslmode=require` 추가

### NextAuth 오류

1. `NEXTAUTH_URL`이 올바른 도메인인지 확인
2. `NEXTAUTH_SECRET`이 설정되었는지 확인
3. 콜백 URL 설정 확인

## 📊 모니터링

Vercel 대시보드에서 다음을 확인할 수 있습니다:

- **Analytics**: 방문자 통계
- **Logs**: 애플리케이션 로그
- **Speed Insights**: 성능 모니터링

## 🔐 보안 권장사항

1. ✅ 강력한 `NEXTAUTH_SECRET` 사용
2. ✅ 프로덕션 데이터베이스에 SSL 연결
3. ✅ 환경 변수는 Vercel에서만 관리
4. ✅ 정기적으로 의존성 업데이트

## 📚 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)


# Vercel 웹사이트에서 배포하기 (간편 방법)

CLI 없이 Vercel 웹사이트에서 바로 배포할 수 있습니다!

## 🚀 5단계로 배포하기

### 1단계: Vercel 로그인

1. **https://vercel.com** 접속
2. **"Sign Up"** 또는 **"Log In"** 클릭
3. **"Continue with GitHub"** 선택
4. GitHub 계정으로 로그인 승인

### 2단계: 프로젝트 Import

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. **"Import Git Repository"** 섹션에서
   - GitHub 저장소 목록에서 **`changleo79/caringnote`** 선택
   - 또는 검색창에 `caringnote` 입력 후 선택
3. **"Import"** 클릭

### 3단계: 프로젝트 설정

Vercel이 자동으로 Next.js 프로젝트를 감지합니다. 다음 설정을 확인하세요:

#### 기본 설정 (자동으로 설정됨)

- ✅ **Framework Preset**: Next.js
- ✅ **Root Directory**: `./`
- ✅ **Build Command**: `npm run build`
- ✅ **Output Directory**: `.next`
- ✅ **Install Command**: `npm install`

#### 프로젝트 이름

- **Project Name**: `caringnote` (원하는 대로 변경 가능)
- 이 이름이 URL에 사용됩니다: `https://caringnote.vercel.app`

### 4단계: 환경 변수 설정 ⚠️ 중요!

**"Environment Variables"** 섹션을 열고 다음 변수들을 추가하세요:

#### 필수 환경 변수

1. **`DATABASE_URL`**
   - 값: 프로덕션 데이터베이스 URL
   - 예시: `postgresql://user:password@host:5432/dbname`
   - 📝 아직 데이터베이스가 없다면 먼저 설정하세요 (아래 참조)

2. **`NEXTAUTH_URL`**
   - 값: `https://caringnote.vercel.app`
   - 📝 배포 후 자동으로 생성되지만, 미리 설정해도 됩니다

3. **`NEXTAUTH_SECRET`**
   - 값: 랜덤 문자열 (비밀키)
   - 생성 방법:
     - 온라인 생성기: https://generate-secret.vercel.app/32
     - 또는 아래 PowerShell 명령어 사용

**NEXTAUTH_SECRET 생성 (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### 환경 변수 추가 방법

각 변수마다:
1. **Key**: 변수명 입력 (예: `DATABASE_URL`)
2. **Value**: 값 입력
3. **Environment**: 
   - ✅ Production
   - ✅ Preview
   - ✅ Development (선택사항)
4. **"Add"** 클릭

### 5단계: 데이터베이스 설정 (Vercel Postgres 권장)

#### 방법 A: Vercel Postgres 사용 (가장 쉬움)

1. Vercel 프로젝트 대시보드에서 **"Storage"** 탭 클릭
2. **"Create Database"** → **"Postgres"** 선택
3. 데이터베이스 이름: `caringnote-db` (또는 원하는 이름)
4. **"Create"** 클릭
5. 생성 후 자동으로 `POSTGRES_URL` 환경 변수가 추가됩니다
6. **Environment Variables**로 돌아가서:
   - `DATABASE_URL` 환경 변수를 찾아서
   - 값에 `POSTGRES_URL`의 값과 동일하게 설정
   - 또는 `DATABASE_URL`을 삭제하고 `POSTGRES_URL`을 사용

#### 방법 B: Supabase 사용

1. https://supabase.com 접속 및 로그인
2. 새 프로젝트 생성
3. Settings → Database → Connection String 복사
4. Vercel 환경 변수에 `DATABASE_URL`로 추가

### 6단계: 배포!

1. 모든 설정이 완료되면 **"Deploy"** 버튼 클릭
2. 배포 진행 상황 확인 (약 2-3분 소요)
3. **배포 완료!** 🎉

### 7단계: 데이터베이스 마이그레이션

배포 후 프로덕션 데이터베이스에 스키마를 적용해야 합니다.

**로컬에서 실행:**

```powershell
# 환경 변수 설정 (프로덕션 DATABASE_URL)
$env:DATABASE_URL="your-production-database-url"

# 마이그레이션 실행
npx prisma db push
```

또는 **Vercel CLI 사용** (설치된 경우):

```powershell
vercel env pull .env.production
npx prisma db push
```

### 8단계: 도메인 확인

배포 완료 후:

1. **배포된 URL 확인**: `https://caringnote.vercel.app`
2. 브라우저에서 접속하여 확인
3. 홈페이지가 정상적으로 표시되는지 확인

## ✅ 배포 확인 체크리스트

- [ ] https://caringnote.vercel.app 접속 가능
- [ ] 홈페이지 표시 확인
- [ ] 회원가입 페이지 접속 확인
- [ ] 로그인 페이지 접속 확인
- [ ] 데이터베이스 연결 확인 (Prisma Studio 또는 로그 확인)

## 🔄 자동 배포 설정

GitHub에 푸시하면 자동으로 재배포됩니다:

```powershell
git add .
git commit -m "변경 내용"
git push
```

Vercel이 자동으로:
- 변경사항 감지
- 빌드 실행
- 재배포 진행

## 🆘 문제 해결

### 빌드 실패

1. **Build Logs 확인**
   - Vercel 대시보드 → Deployments → 실패한 배포 클릭
   - Build Logs 탭에서 오류 확인

2. **일반적인 원인**
   - 환경 변수 누락
   - 데이터베이스 연결 실패
   - Prisma 클라이언트 생성 실패

### 데이터베이스 오류

1. **`DATABASE_URL` 환경 변수 확인**
2. **데이터베이스 연결 가능 여부 확인**
3. **마이그레이션 실행 여부 확인**

### NextAuth 오류

1. **`NEXTAUTH_URL` 확인**: 정확한 도메인인지 확인
2. **`NEXTAUTH_SECRET` 확인**: 설정되어 있는지 확인

## 📚 추가 리소스

- **Vercel 대시보드**: https://vercel.com/dashboard
- **프로젝트 설정**: Vercel 대시보드 → 프로젝트 → Settings
- **환경 변수 관리**: Settings → Environment Variables
- **도메인 설정**: Settings → Domains

## 🎊 완료!

배포가 완료되면 https://caringnote.vercel.app 에서 확인할 수 있습니다!


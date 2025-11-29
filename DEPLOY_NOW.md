# 🚀 지금 바로 배포하기 - caringnote.vercel.app

## 현재 상태

✅ **개발 완료된 기능:**
- 프로젝트 기본 구조
- 인증 시스템 (회원가입, 로그인)
- 데이터베이스 스키마
- 홈페이지 및 대시보드
- 반응형 UI/UX

## 📋 배포 단계별 가이드

### 1단계: Vercel 접속 및 로그인 (2분)

1. **https://vercel.com** 접속
2. **"Sign Up"** 또는 **"Log In"** 클릭
3. **"Continue with GitHub"** 선택
4. GitHub 계정으로 로그인 승인

### 2단계: 프로젝트 Import (1분)

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. **"Import Git Repository"** 섹션에서
   - **`changleo79/caringnote`** 선택
   - 또는 검색창에 `caringnote` 입력
3. **"Import"** 버튼 클릭

### 3단계: 프로젝트 설정 (1분)

#### 자동 감지된 설정 (확인만 하세요)

- ✅ **Framework Preset**: Next.js
- ✅ **Root Directory**: `./`
- ✅ **Build Command**: `npm run build`
- ✅ **Output Directory**: `.next`
- ✅ **Install Command**: `npm install`

#### 프로젝트 이름 설정

- **Project Name**: `caringnote` 입력
- → 자동으로 URL: `https://caringnote.vercel.app` 생성

**"Continue"** 또는 **"Deploy"** 버튼을 **아직 누르지 마세요!**

### 4단계: 환경 변수 설정 ⚠️ 중요! (5분)

**"Environment Variables"** 섹션을 펼치세요.

#### 4-1. NEXTAUTH_SECRET 생성

먼저 비밀키를 생성하세요:

**온라인 생성기 (권장):**
1. https://generate-secret.vercel.app/32 접속
2. 생성된 문자열 복사

**또는 PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### 4-2. 환경 변수 추가

각 변수마다 **"Add"** 클릭하여 추가:

| 변수명 | 값 | Environment |
|--------|-----|-------------|
| `NEXTAUTH_URL` | `https://caringnote.vercel.app` | ✅ Production<br>✅ Preview<br>✅ Development |
| `NEXTAUTH_SECRET` | (위에서 생성한 비밀키) | ✅ Production<br>✅ Preview<br>✅ Development |

#### 4-3. DATABASE_URL 추가 (데이터베이스 설정 후)

데이터베이스는 아래 5단계에서 설정합니다. 일단은 건너뛰고 배포 후 설정해도 됩니다.

### 5단계: 데이터베이스 설정 (5분)

#### 방법 A: Vercel Postgres (가장 쉬움, 추천)

1. 설정 화면에서 **"Storage"** 탭 클릭
   - 또는 배포 후 프로젝트 대시보드 → **"Storage"** 탭
2. **"Create Database"** 버튼 클릭
3. **"Postgres"** 선택
4. Database Name: `caringnote-db` (또는 원하는 이름)
5. Region: `Seoul (icn1)` 선택 (한국)
6. **"Create"** 클릭
7. 생성 완료 후:
   - `POSTGRES_URL` 환경 변수가 자동 추가됨
   - **Settings** → **Environment Variables**로 이동
   - `DATABASE_URL` 환경 변수 추가
   - 값: `POSTGRES_URL`의 값과 동일하게 입력
   - Environment: Production, Preview, Development 모두 선택
   - **"Save"** 클릭

#### 방법 B: Supabase (무료 옵션)

1. https://supabase.com 접속 및 로그인
2. **"New Project"** 클릭
3. 프로젝트 이름: `caringnote`
4. Database Password 설정 (기억해두세요!)
5. Region: `Northeast Asia (Seoul)` 선택
6. **"Create new project"** 클릭
7. 생성 완료 후:
   - Settings → Database → Connection string
   - "URI" 탭 선택
   - Connection string 복사 (예: `postgresql://postgres:[YOUR-PASSWORD]@...`)
8. Vercel 환경 변수에 추가:
   - Key: `DATABASE_URL`
   - Value: 복사한 Connection string
   - Environment: Production, Preview, Development 모두 선택

### 6단계: 배포! (2-3분)

1. 모든 설정 완료 후
2. **"Deploy"** 버튼 클릭
3. 배포 진행 상황 확인 (2-3분 소요)
4. **"Ready"** 또는 **"Deployed"** 표시 확인

### 7단계: 데이터베이스 마이그레이션 (3분)

배포가 완료되면 프로덕션 데이터베이스에 스키마를 적용해야 합니다.

**로컬에서 실행:**

```powershell
# 1. 프로덕션 DATABASE_URL 환경 변수 설정
# Vercel 대시보드 → Settings → Environment Variables에서 복사
$env:DATABASE_URL="postgresql://..."

# 2. 데이터베이스 스키마 적용
npx prisma db push

# 3. 성공 메시지 확인
# "Your database is now in sync with your Prisma schema"
```

**또는 Vercel Postgres를 사용한 경우:**

Vercel 대시보드에서 자동으로 스키마가 생성됩니다. 필요 시 위 명령어로 확인하세요.

### 8단계: 확인! (1분)

1. **배포 완료 후 제공되는 URL 확인**
   - 또는 https://caringnote.vercel.app 접속

2. **기능 테스트:**
   - ✅ 홈페이지 표시 확인
   - ✅ 회원가입 페이지 접속
   - ✅ 로그인 페이지 접속
   - ✅ 회원가입 테스트 (요양원 없이도 가능)

## 🎉 배포 완료!

축하합니다! 이제 **https://caringnote.vercel.app** 에서 서비스를 확인할 수 있습니다!

## 🔄 이후 작업

### 자동 배포

이제 GitHub에 푸시하면 자동으로 재배포됩니다:

```powershell
git add .
git commit -m "변경 내용"
git push  # ← 자동 배포 시작!
```

### 환경 변수 관리

- Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
- 언제든지 추가/수정 가능
- 변경 후 재배포 필요

### 모니터링

- **Logs**: Vercel 대시보드 → 프로젝트 → Logs
- **Analytics**: 사용자 통계 확인
- **Deployments**: 배포 이력 확인

## 🆘 문제 해결

### 빌드 실패

1. Vercel 대시보드 → Deployments → 실패한 배포 클릭
2. Build Logs 탭에서 오류 확인
3. 일반적인 원인:
   - 환경 변수 누락
   - Prisma 클라이언트 생성 실패
   - 데이터베이스 연결 실패

### 데이터베이스 오류

1. `DATABASE_URL` 환경 변수 확인
2. 데이터베이스 접근 가능 여부 확인
3. 마이그레이션 실행 여부 확인

### NextAuth 오류

1. `NEXTAUTH_URL`이 정확한 도메인인지 확인
2. `NEXTAUTH_SECRET`이 설정되었는지 확인

## 📚 추가 리소스

- **Vercel 대시보드**: https://vercel.com/dashboard
- **프로젝트 설정**: 프로젝트 → Settings
- **환경 변수**: Settings → Environment Variables
- **도메인 설정**: Settings → Domains

## ✅ 체크리스트

배포 전:
- [ ] Vercel 계정 생성 및 GitHub 연동
- [ ] 프로젝트 Import
- [ ] `NEXTAUTH_URL` 환경 변수 추가
- [ ] `NEXTAUTH_SECRET` 환경 변수 추가
- [ ] 데이터베이스 생성 (Vercel Postgres 또는 Supabase)
- [ ] `DATABASE_URL` 환경 변수 추가

배포 후:
- [ ] 배포 완료 확인
- [ ] 데이터베이스 마이그레이션 실행
- [ ] https://caringnote.vercel.app 접속 확인
- [ ] 홈페이지 표시 확인
- [ ] 회원가입/로그인 테스트

---

**준비 완료! 지금 바로 배포하세요!** 🚀


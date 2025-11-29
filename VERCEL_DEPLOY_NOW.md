# Vercel 배포 가이드 - caringnote.vercel.app

## 🚀 빠른 배포 방법

### 방법 1: Vercel CLI 사용 (권장)

#### 1단계: Vercel CLI 설치

```powershell
npm install -g vercel
```

#### 2단계: Vercel 로그인

```powershell
vercel login
```

브라우저가 열리고 GitHub 계정으로 로그인하세요.

#### 3단계: 프로젝트 배포

```powershell
# 프로젝트 폴더에서
vercel

# 또는 프로덕션 배포
vercel --prod
```

질문에 답변:
- Set up and deploy? **Y**
- Which scope? **changleo79** 선택
- Link to existing project? **N** (처음 배포)
- Project name: **caringnote** (또는 엔터)
- Directory: **./** (엔터)
- Override settings? **N**

#### 4단계: 커스텀 도메인 설정 (선택사항)

```powershell
vercel domains add caringnote.vercel.app
```

### 방법 2: Vercel 웹사이트에서 배포

1. **Vercel 로그인**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 Import**
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 목록에서 `changleo79/caringnote` 선택
   - 또는 Import Git Repository에서 직접 입력

3. **프로젝트 설정**
   - Framework Preset: Next.js (자동 감지)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **환경 변수 설정**
   - Environment Variables 섹션에서 다음 추가:
   
   ```
   DATABASE_URL=your_production_database_url
   NEXTAUTH_URL=https://caringnote.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   ```

5. **배포**
   - "Deploy" 버튼 클릭
   - 배포 완료 대기 (약 2-3분)

6. **도메인 설정**
   - 프로젝트 대시보드 → Settings → Domains
   - `caringnote.vercel.app` 확인 또는 커스텀 도메인 추가

## 🔧 환경 변수 설정

배포 전에 다음 환경 변수를 Vercel 대시보드에서 설정하세요:

### 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DATABASE_URL` | 프로덕션 데이터베이스 URL | `postgresql://...` |
| `NEXTAUTH_URL` | 앱 URL | `https://caringnote.vercel.app` |
| `NEXTAUTH_SECRET` | NextAuth 비밀키 | 랜덤 문자열 |

### NEXTAUTH_SECRET 생성

PowerShell에서:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## 🗄️ 프로덕션 데이터베이스 설정

### 옵션 1: Vercel Postgres (권장)

1. Vercel 프로젝트 대시보드 → Storage 탭
2. "Create Database" → "Postgres" 선택
3. 데이터베이스 생성
4. `POSTGRES_URL` 자동 생성됨
5. `DATABASE_URL` 환경 변수에 `POSTGRES_URL`과 동일하게 설정

### 옵션 2: Supabase

1. https://supabase.com에서 프로젝트 생성
2. Settings → Database에서 연결 문자열 복사
3. Vercel 환경 변수에 `DATABASE_URL` 추가

## 📝 데이터베이스 마이그레이션

프로덕션 데이터베이스에 스키마를 적용해야 합니다:

```powershell
# 환경 변수 설정
$env:DATABASE_URL="your-production-database-url"

# 마이그레이션 실행
npx prisma db push
```

## ✅ 배포 확인

배포 완료 후:

1. ✅ https://caringnote.vercel.app 접속 확인
2. ✅ 홈페이지 표시 확인
3. ✅ 회원가입 기능 테스트
4. ✅ 로그인 기능 테스트

## 🔄 이후 배포

GitHub에 푸시하면 자동으로 재배포됩니다:

```powershell
git add .
git commit -m "변경 내용"
git push
```

## 🆘 문제 해결

### 빌드 실패

- Build Logs에서 오류 확인
- 환경 변수 누락 확인
- `DATABASE_URL` 확인

### 데이터베이스 연결 오류

- `DATABASE_URL` 환경 변수 확인
- 프로덕션 데이터베이스 접근 가능 여부 확인

### NextAuth 오류

- `NEXTAUTH_URL`이 정확한 도메인인지 확인
- `NEXTAUTH_SECRET` 설정 확인

## 📚 참고 문서

- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - 상세 Vercel 설정 가이드
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 배포 가이드


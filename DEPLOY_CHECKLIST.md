# 🚀 Vercel 배포 체크리스트

## 현재 개발 완료 상태

### ✅ 완료된 기능

1. **기본 구조**
   - ✅ Next.js 14 프로젝트 설정
   - ✅ TypeScript 설정
   - ✅ Tailwind CSS 설정
   - ✅ 반응형 레이아웃

2. **인증 시스템**
   - ✅ 회원가입 (요양원 선택 포함)
   - ✅ 로그인
   - ✅ 세션 관리
   - ✅ 역할 기반 접근 제어

3. **데이터베이스**
   - ✅ Prisma 스키마 설계 완료
   - ✅ 모든 모델 정의 (요양원, 사용자, 입소자, 게시글, 의료기록, 상품, 주문 등)

4. **UI/UX**
   - ✅ 홈페이지
   - ✅ 로그인/회원가입 페이지
   - ✅ 대시보드 레이아웃
   - ✅ 모바일/데스크톱 네비게이션

5. **API**
   - ✅ 인증 API
   - ✅ 요양원 목록 API

### 🚧 개발 중인 기능

- 커뮤니티 기능 (게시글 작성, 이미지 업로드)
- 의료 정보 관리
- 쇼핑몰 기능

## 📋 배포 전 체크리스트

### 1. 코드 준비 ✅

- [x] 모든 파일이 Git에 커밋됨
- [x] GitHub에 푸시됨
- [x] `vercel.json` 설정 완료
- [x] `package.json`에 필요한 스크립트 포함
- [x] Prisma `postinstall` 스크립트 설정

### 2. 환경 변수 준비

다음 환경 변수들을 Vercel에 설정해야 합니다:

#### 필수 환경 변수

```env
# 데이터베이스
DATABASE_URL=프로덕션_데이터베이스_URL

# NextAuth
NEXTAUTH_URL=https://caringnote.vercel.app
NEXTAUTH_SECRET=생성한_비밀키
```

#### 환경 변수 생성 방법

**NEXTAUTH_SECRET:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

또는 온라인 생성기: https://generate-secret.vercel.app/32

### 3. 데이터베이스 설정

#### 옵션 1: Vercel Postgres (권장)

1. Vercel 프로젝트 → Storage 탭
2. "Create Database" → Postgres
3. 데이터베이스 생성
4. `POSTGRES_URL` 자동 생성됨
5. `DATABASE_URL` 환경 변수에 `POSTGRES_URL` 값 복사

#### 옵션 2: Supabase

1. Supabase에서 프로젝트 생성
2. Connection String 복사
3. Vercel 환경 변수에 `DATABASE_URL`로 추가

### 4. 배포 단계

#### Vercel 웹사이트에서 배포

1. **Vercel 로그인**
   - https://vercel.com
   - GitHub 계정으로 로그인

2. **프로젝트 Import**
   - "Add New..." → "Project"
   - `changleo79/caringnote` 선택
   - Import 클릭

3. **프로젝트 설정**
   - Project Name: `caringnote`
   - Framework: Next.js (자동 감지)
   - Root Directory: `./`
   - Build Command: `npm run build` (자동)
   - Output Directory: `.next` (자동)

4. **환경 변수 설정**
   - Environment Variables 섹션에서 위의 필수 변수들 추가
   - Environment: Production, Preview, Development 모두 선택

5. **Deploy!**
   - "Deploy" 버튼 클릭
   - 배포 진행 대기 (2-3분)

6. **데이터베이스 마이그레이션**
   - 배포 완료 후 로컬에서:
   ```powershell
   $env:DATABASE_URL="프로덕션_DATABASE_URL"
   npx prisma db push
   ```

### 5. 배포 후 확인

- [ ] https://caringnote.vercel.app 접속 가능
- [ ] 홈페이지 표시 확인
- [ ] 회원가입 페이지 접속 확인
- [ ] 로그인 기능 테스트
- [ ] 데이터베이스 연결 확인

## 🔧 빌드 확인 (선택사항)

로컬에서 빌드 테스트:

```powershell
npm run build
```

빌드 성공 시 `.next` 폴더가 생성됩니다.

## 📝 주의사항

### 환경 변수

- ✅ `.env.local` 파일은 Git에 커밋되지 않음 (`.gitignore`에 포함)
- ✅ 환경 변수는 Vercel 대시보드에서만 관리
- ✅ 각 환경(Production, Preview, Development)별로 설정 가능

### 데이터베이스

- ✅ 개발: SQLite 사용 가능
- ✅ 프로덕션: PostgreSQL 사용 필수 (Vercel Postgres, Supabase 등)
- ✅ 배포 후 반드시 마이그레이션 실행

### NextAuth

- ✅ `NEXTAUTH_URL`은 정확한 도메인으로 설정
- ✅ `NEXTAUTH_SECRET`은 강력한 랜덤 문자열 사용

## 🎯 배포 후 다음 단계

1. **기능 개발 계속**
   - 커뮤니티 기능 구현
   - 의료 정보 관리 기능
   - 쇼핑몰 기능

2. **자동 배포 확인**
   - GitHub에 푸시하면 자동 재배포
   - Pull Request마다 Preview 배포

3. **모니터링**
   - Vercel 대시보드에서 로그 확인
   - 에러 모니터링

## 🆘 문제 해결

### 빌드 실패
- Build Logs 확인
- 환경 변수 누락 확인
- Prisma 클라이언트 생성 확인

### 데이터베이스 오류
- `DATABASE_URL` 확인
- 마이그레이션 실행 여부 확인
- 데이터베이스 접근 권한 확인

### NextAuth 오류
- `NEXTAUTH_URL` 도메인 확인
- `NEXTAUTH_SECRET` 설정 확인

## ✅ 준비 완료!

모든 준비가 완료되었습니다. Vercel 웹사이트에서 배포를 진행하세요!

📖 **상세 가이드**: [VERCEL_WEB_DEPLOY.md](./VERCEL_WEB_DEPLOY.md)


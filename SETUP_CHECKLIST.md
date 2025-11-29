# 설정 체크리스트

이 문서는 프로젝트 설정 단계를 체계적으로 진행하기 위한 체크리스트입니다.

## ✅ 로컬 개발 환경

### 1. 필수 소프트웨어 설치

- [ ] Node.js 18.x 이상 설치
  - 확인: `node --version`
- [ ] npm 설치 확인
  - 확인: `npm --version`
- [ ] Git 설치 확인
  - 확인: `git --version`

### 2. 프로젝트 초기 설정

- [ ] 프로젝트 폴더로 이동
  ```bash
  cd "care app"
  ```
- [ ] 의존성 패키지 설치
  ```bash
  npm install
  ```
- [ ] 환경 변수 파일 생성
  ```bash
  # Windows
  Copy-Item .env.local.example .env.local
  
  # Mac/Linux
  cp .env.local.example .env.local
  ```
- [ ] `.env.local` 파일 편집
  - [ ] `DATABASE_URL` 설정
  - [ ] `NEXTAUTH_URL` 설정
  - [ ] `NEXTAUTH_SECRET` 생성 및 설정

### 3. 데이터베이스 설정

- [ ] Prisma 클라이언트 생성
  ```bash
  npm run db:generate
  ```
- [ ] 데이터베이스 초기화
  ```bash
  npm run db:push
  ```
- [ ] Prisma Studio 실행 (선택사항, GUI로 데이터 확인)
  ```bash
  npm run db:studio
  ```

### 4. 개발 서버 실행

- [ ] 개발 서버 시작
  ```bash
  npm run dev
  ```
- [ ] 브라우저에서 접속 확인
  - [ ] http://localhost:3000 접속 성공
  - [ ] 홈페이지 표시 확인
  - [ ] 회원가입 페이지 접속 확인

## ✅ GitHub 설정

### 1. GitHub 저장소 생성

- [ ] GitHub에 로그인
- [ ] 새 저장소 생성
  - [ ] 저장소 이름: `care-app`
  - [ ] Description 작성
  - [ ] Private/Public 선택
  - [ ] README 초기화 체크 해제 (이미 있음)

### 2. Git 초기화 및 연결

- [ ] Git 초기화
  ```bash
  git init
  ```
- [ ] 모든 파일 추가
  ```bash
  git add .
  ```
- [ ] 첫 커밋
  ```bash
  git commit -m "Initial commit: 요양원 케어 플랫폼 프로젝트 시작"
  ```
- [ ] 원격 저장소 연결
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/care-app.git
  ```
- [ ] 브랜치 이름 변경
  ```bash
  git branch -M main
  ```
- [ ] GitHub에 푸시
  ```bash
  git push -u origin main
  ```

### 3. GitHub 저장소 확인

- [ ] GitHub 저장소 접속
- [ ] 모든 파일 업로드 확인
- [ ] README.md 표시 확인

## ✅ Vercel 배포

### 1. Vercel 계정 설정

- [ ] Vercel 가입/로그인
- [ ] GitHub 계정 연동
- [ ] Vercel 대시보드 접속 확인

### 2. 프로젝트 Import

- [ ] "Add New..." → "Project" 클릭
- [ ] GitHub 저장소 목록에서 `care-app` 선택
- [ ] 또는 저장소 URL 직접 입력
- [ ] Import 확인

### 3. 프로젝트 설정

- [ ] Framework Preset: Next.js 확인
- [ ] Root Directory: `./` 확인
- [ ] Build Command: `npm run build` 확인
- [ ] Output Directory: `.next` 확인

### 4. 환경 변수 설정

- [ ] `DATABASE_URL` 추가 (프로덕션 데이터베이스)
- [ ] `NEXTAUTH_URL` 추가 (배포 후 자동 생성되지만 미리 추가 가능)
- [ ] `NEXTAUTH_SECRET` 추가

### 5. 프로덕션 데이터베이스 설정

다음 중 하나 선택:

#### 옵션 A: Vercel Postgres

- [ ] Vercel 프로젝트 → Storage 탭
- [ ] "Create Database" → Postgres 선택
- [ ] 데이터베이스 생성
- [ ] `POSTGRES_URL` 환경 변수 확인
- [ ] `DATABASE_URL`을 `POSTGRES_URL`과 동일하게 설정

#### 옵션 B: Supabase

- [ ] Supabase에서 프로젝트 생성
- [ ] Database 연결 문자열 복사
- [ ] Vercel 환경 변수에 `DATABASE_URL` 추가

#### 옵션 C: PlanetScale

- [ ] PlanetScale에서 데이터베이스 생성
- [ ] 연결 문자열 복사
- [ ] Vercel 환경 변수에 `DATABASE_URL` 추가

### 6. 데이터베이스 마이그레이션

- [ ] Vercel CLI 설치 (선택사항)
  ```bash
  npm i -g vercel
  ```
- [ ] 로컬에서 프로덕션 데이터베이스 마이그레이션
  ```bash
  DATABASE_URL="your-production-url" npx prisma db push
  ```

### 7. 배포

- [ ] "Deploy" 버튼 클릭
- [ ] 빌드 로그 확인
- [ ] 배포 완료 대기 (약 2-3분)
- [ ] 배포 성공 확인

### 8. 배포 후 확인

- [ ] 배포된 URL 접속
- [ ] 홈페이지 표시 확인
- [ ] 회원가입 테스트
- [ ] 로그인 테스트
- [ ] API 엔드포인트 테스트

## ✅ 최종 확인

### 기능 테스트

- [ ] 홈페이지 접속 및 표시
- [ ] 회원가입 기능
  - [ ] 가족 회원 가입
  - [ ] 요양원 직원 가입
  - [ ] 요양원 선택 기능
- [ ] 로그인 기능
- [ ] 대시보드 접속

### 보안 확인

- [ ] `.env.local` 파일이 Git에 커밋되지 않음
- [ ] 환경 변수가 Vercel에 올바르게 설정됨
- [ ] `NEXTAUTH_SECRET`이 강력한 값으로 설정됨

### 문서 확인

- [ ] README.md 읽기
- [ ] PROJECT_GUIDE.md 읽기
- [ ] GITHUB_SETUP.md 읽기
- [ ] VERCEL_SETUP.md 읽기

## 🎉 완료!

모든 체크리스트를 완료했다면 프로젝트 개발을 시작할 준비가 되었습니다!

다음 단계:
- 커뮤니티 기능 개발
- 의료 정보 기능 개발
- 쇼핑몰 기능 개발


# 빠른 시작 가이드

요양원 케어 플랫폼 프로젝트를 빠르게 시작하는 방법입니다.

## 🚀 5분 안에 시작하기

### 1. 로컬 개발 환경 설정

#### Windows

```powershell
# 프로젝트 폴더에서 실행
.\scripts\setup.ps1
```

또는 수동으로:

```powershell
npm install
Copy-Item .env.local.example .env.local
npm run db:generate
npm run db:push
npm run dev
```

#### Mac/Linux

```bash
# 실행 권한 부여
chmod +x scripts/setup.sh

# 스크립트 실행
./scripts/setup.sh
```

또는 수동으로:

```bash
npm install
cp .env.local.example .env.local
npm run db:generate
npm run db:push
npm run dev
```

### 2. 환경 변수 설정

`.env.local` 파일을 열어 다음 값을 설정하세요:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**NEXTAUTH_SECRET 생성:**

```bash
# Mac/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속!

## 📦 GitHub 설정

### 첫 번째 커밋 및 푸시

```bash
# 1. Git 초기화
git init

# 2. 파일 추가
git add .

# 3. 첫 커밋
git commit -m "Initial commit: 요양원 케어 플랫폼 프로젝트 시작"

# 4. GitHub 저장소 연결 (YOUR_USERNAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/care-app.git

# 5. 푸시
git branch -M main
git push -u origin main
```

📖 **자세한 내용**: [GITHUB_SETUP.md](./GITHUB_SETUP.md) 참조

## 🌐 Vercel 배포

### 빠른 배포

1. [Vercel](https://vercel.com)에 GitHub 계정으로 로그인
2. **Add New...** → **Project** 클릭
3. GitHub 저장소 선택
4. 환경 변수 설정:
   - `DATABASE_URL` (프로덕션 데이터베이스 URL)
   - `NEXTAUTH_URL` (배포 후 자동 생성됨)
   - `NEXTAUTH_SECRET` (생성한 비밀키)
5. **Deploy** 클릭!

📖 **자세한 내용**: [VERCEL_SETUP.md](./VERCEL_SETUP.md) 참조

## ✅ 체크리스트

로컬 개발:
- [ ] Node.js 18.x 이상 설치 확인
- [ ] `npm install` 실행 완료
- [ ] `.env.local` 파일 생성 및 설정
- [ ] `npm run db:generate` 실행 완료
- [ ] `npm run db:push` 실행 완료
- [ ] `npm run dev`로 서버 실행 확인

GitHub:
- [ ] GitHub 저장소 생성 완료
- [ ] Git 초기화 및 첫 커밋 완료
- [ ] GitHub에 푸시 완료

Vercel:
- [ ] Vercel 계정 생성 및 GitHub 연동
- [ ] 프로젝트 Import 완료
- [ ] 환경 변수 설정 완료
- [ ] 배포 완료 및 접속 확인

## 🆘 문제 해결

### 의존성 설치 오류

```bash
# 캐시 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 데이터베이스 오류

```bash
# Prisma 클라이언트 재생성
npm run db:generate

# 데이터베이스 재초기화
npm run db:push
```

### 포트 충돌

포트 3000이 사용 중이라면:

```bash
# 다른 포트로 실행
PORT=3001 npm run dev
```

### Git 인증 오류

Personal Access Token 사용:

1. GitHub → Settings → Developer settings → Personal access tokens
2. 새 토큰 생성
3. 비밀번호 대신 토큰 사용

## 📚 다음 단계

- [ ] 커뮤니티 기능 개발 시작
- [ ] 의료 정보 기능 개발
- [ ] 쇼핑몰 기능 개발
- [ ] 프로덕션 데이터베이스 설정
- [ ] 커스텀 도메인 설정

더 많은 정보는 [PROJECT_GUIDE.md](./PROJECT_GUIDE.md)를 참조하세요!


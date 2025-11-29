# 요양원 케어 플랫폼 (Care App)

요양원에 계신 부모님들의 생활을 지원하고 가족들과 소통할 수 있는 통합 플랫폼입니다.

## 주요 기능

### 1. 📸 사진 공유 및 커뮤니티
- 요양원에서 부모님의 일상 사진 공유
- 가족들과의 댓글 및 메시지 소통
- 실시간 알림 기능

### 2. 🏥 의료 정보 공유
- 건강 상태 기록 및 공유
- 진료 및 약물 복용 정보 관리
- 의료진과 가족 간 소통

### 3. 🛒 생필품 쇼핑몰
- 부모님께 필요한 생필품 구매
- 요양원으로 직접 배송
- 간편한 결제 시스템

### 4. 👥 회원 관리
- 요양원 회원 / 일반 회원 구분
- 요양원 선택 기반 가입 시스템
- 역할별 접근 권한 관리

## 기술 스택

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM (PostgreSQL/SQLite)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **Blockchain**: Saseul (통합 예정)

## 🚀 빠른 시작

새로 시작하시나요? [QUICKSTART.md](./QUICKSTART.md)를 먼저 확인하세요!

## 시작하기

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 저장소 클론 (또는 다운로드)
git clone https://github.com/YOUR_USERNAME/care-app.git
cd care-app

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일을 편집하여 필요한 설정을 추가하세요

# 4. 데이터베이스 설정
npm run db:generate
npm run db:push

# 5. 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 환경 변수 설정

`.env.local` 파일에 다음 정보를 설정하세요:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**NEXTAUTH_SECRET 생성 방법:**
```bash
openssl rand -base64 32
```

## 프로젝트 구조

```
care-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (main)/            # 메인 앱 페이지
│   ├── api/               # API 라우트
│   └── layout.tsx         # 루트 레이아웃
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   └── features/         # 기능별 컴포넌트
├── lib/                  # 유틸리티 및 헬퍼 함수
├── prisma/               # Prisma 스키마 및 마이그레이션
├── public/               # 정적 파일
└── types/                # TypeScript 타입 정의
```

## GitHub 및 Vercel 배포

### GitHub 저장소 설정

```bash
# 1. Git 초기화 (아직 안 했다면)
git init

# 2. 파일 추가 및 커밋
git add .
git commit -m "Initial commit: 요양원 케어 플랫폼 프로젝트 시작"

# 3. GitHub에 새 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/care-app.git
git branch -M main
git push -u origin main
```

### Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 선택 또는 Import
4. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (기본값)
   - **Install Command**: `npm install`

5. **환경 변수 설정** (Vercel 대시보드에서):
   ```
   DATABASE_URL=your_production_database_url
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-production-secret-key
   ```

6. **배포** 클릭

> 📝 **프로덕션 데이터베이스 권장사항**: Vercel Postgres, Supabase, 또는 PlanetScale 사용을 권장합니다. 자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

## 개발 로드맵

- [x] 프로젝트 초기 설정
- [x] 데이터베이스 스키마 설계
- [x] 인증 시스템 구현
- [x] GitHub 및 Vercel 설정
- [ ] 사진 공유 기능
- [ ] 의료 정보 관리 기능
- [ ] 쇼핑몰 기능
- [ ] Saseul 블록체인 통합
- [ ] 모바일 앱 전환 (PWA/React Native)

## 📚 참고 문서

- [QUICKSTART.md](./QUICKSTART.md) - 빠른 시작 가이드
- [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - 설정 체크리스트
- [GITHUB_SETUP.md](./GITHUB_SETUP.md) - GitHub 저장소 설정 가이드
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Vercel 배포 설정 가이드
- [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) - 상세 개발 가이드
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 배포 가이드
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 기여 가이드

## 라이선스

Private


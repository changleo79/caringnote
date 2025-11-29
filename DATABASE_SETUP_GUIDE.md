# 데이터베이스 설정 가이드 🗄️

케어링노트 앱을 사용하기 위해서는 PostgreSQL 데이터베이스를 설정해야 합니다.  
다음 3가지 단계를 순서대로 진행하세요.

---

## 📋 단계 1: Vercel에서 PostgreSQL 데이터베이스 생성

### 1-1. Vercel 대시보드 접속
1. 브라우저에서 [https://vercel.com](https://vercel.com) 접속
2. 로그인 후 우측 상단의 **프로필 아이콘** 클릭
3. **Dashboard** 클릭

### 1-2. 프로젝트 선택
1. 대시보드에서 **"care app"** 또는 프로젝트 이름 클릭
2. 프로젝트 상세 페이지로 이동

### 1-3. Storage 탭으로 이동
1. 상단 메뉴에서 **"Storage"** 탭 클릭
2. "Storage" 탭이 보이지 않으면 **"Settings"** → **"Storage"** 메뉴 확인

### 1-4. PostgreSQL 생성
1. **"Create Database"** 또는 **"Add Database"** 버튼 클릭
2. 데이터베이스 유형 선택 화면에서 **"Postgres"** 선택
3. **"Create"** 또는 **"Continue"** 클릭
4. 데이터베이스 이름 입력 (예: `caringnote-db`)
5. 지역 선택: **"Seoul (icn1)"** 또는 **"Asia Pacific (Tokyo)"**
6. 플랜 선택: **"Hobby"** (무료 플랜)
7. **"Create"** 버튼 클릭하여 데이터베이스 생성

### 1-5. 생성 완료 대기
- 데이터베이스 생성에는 1-2분 정도 소요됩니다
- 상태가 **"Active"** 또는 **"Ready"**로 변경되면 완료

---

## 🔐 단계 2: 환경 변수 설정 (DATABASE_URL)

### 2-1. 데이터베이스 연결 정보 확인
1. Storage 탭에서 생성한 PostgreSQL 데이터베이스 클릭
2. **"Settings"** 또는 **"Connection Info"** 섹션 확인
3. 다음 정보를 복사하세요:
   - **Connection String** 또는 **DATABASE_URL**
   - 또는 개별 정보:
     - Host
     - Database
     - User
     - Password
     - Port

### 2-2. 환경 변수 페이지로 이동
1. 프로젝트 대시보드에서 **"Settings"** 탭 클릭
2. 왼쪽 사이드바에서 **"Environment Variables"** 클릭

### 2-3. DATABASE_URL 환경 변수 추가

#### 방법 A: Connection String 전체 복사
1. **"Add New"** 또는 **"Add Environment Variable"** 클릭
2. **Key**: `DATABASE_URL` 입력
3. **Value**: 복사한 Connection String 붙여넣기
   - 예: `postgres://user:password@host:port/database?sslmode=require`
4. **Environment**: 모든 환경 선택 (Production, Preview, Development 모두 체크)
5. **"Save"** 클릭

#### 방법 B: 개별 정보로 구성
Connection String이 없으면 다음 형식으로 직접 입력:
```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?sslmode=require
```
각 값을 실제 정보로 대체:
- `[USER]`: 데이터베이스 사용자명
- `[PASSWORD]`: 비밀번호
- `[HOST]`: 호스트 주소
- `[PORT]`: 포트 번호 (일반적으로 5432)
- `[DATABASE]`: 데이터베이스 이름

### 2-4. POSTGRES_PRISMA_URL 설정 (선택사항)
Prisma를 사용하는 경우, 추가 환경 변수가 필요할 수 있습니다:
1. `POSTGRES_PRISMA_URL`: `DATABASE_URL`과 동일한 값
2. `POSTGRES_URL_NON_POOLING`: Connection String에서 `?sslmode=require` 부분 제거한 버전

### 2-5. 환경 변수 확인
1. 설정한 환경 변수 목록 확인
2. `DATABASE_URL`이 보이는지 확인
3. 모든 환경(Production, Preview, Development)에 적용되었는지 확인

---

## 🌱 단계 3: 요양원 시드 데이터 생성

### 3-1. Prisma 마이그레이션 실행
데이터베이스 스키마를 생성하기 위해 마이그레이션이 필요합니다.

#### 방법 A: Vercel CLI 사용 (로컬)
```bash
# Vercel CLI 설치 (없는 경우)
npm install -g vercel

# Vercel 로그인
vercel login

# 환경 변수 가져오기
vercel env pull

# Prisma 마이그레이션
npx prisma migrate deploy

# Prisma 클라이언트 생성
npx prisma generate

# 시드 데이터 생성
npx prisma db seed
```

#### 방법 B: Vercel 대시보드에서 직접 실행 (API 사용)
1. 브라우저에서 다음 URL 접속:
   ```
   https://[your-vercel-url].vercel.app/api/care-centers/seed
   ```
   - `[your-vercel-url]`을 실제 Vercel URL로 변경
   - 예: `https://care-app.vercel.app/api/care-centers/seed`

2. 페이지가 열리면 **"POST"** 요청이 필요하므로:
   - 브라우저 개발자 도구 (F12) 열기
   - Console 탭에서 다음 명령어 실행:
   ```javascript
   fetch('/api/care-centers/seed', { method: 'POST' })
     .then(r => r.json())
     .then(console.log)
   ```

3. 또는 API 테스트 도구 사용:
   - [Postman](https://www.postman.com/)
   - [Insomnia](https://insomnia.rest/)
   - 브라우저 확장 프로그램: REST Client
   
   요청 설정:
   - **Method**: POST
   - **URL**: `https://[your-vercel-url].vercel.app/api/care-centers/seed`
   - **Headers**: Content-Type: application/json

### 3-2. 시드 데이터 확인
시드 데이터가 정상적으로 생성되었는지 확인:

1. **API로 확인**:
   ```
   https://[your-vercel-url].vercel.app/api/care-centers
   ```
   이 URL을 브라우저에서 접속하면 요양원 목록이 JSON 형태로 표시됩니다.

2. **회원가입 페이지 확인**:
   - 회원가입 페이지 (`/auth/signup`) 접속
   - "요양원 선택" 드롭다운에 요양원 목록이 보이는지 확인

### 3-3. 생성될 시드 데이터
다음 요양원이 자동으로 생성됩니다:
- 행복 요양원 (서울특별시 강남구)
- 사랑 요양원 (서울특별시 서초구)
- 평화 요양원 (서울특별시 송파구)

---

## ✅ 완료 확인 체크리스트

모든 단계가 완료되었는지 확인하세요:

- [ ] Vercel에서 PostgreSQL 데이터베이스 생성 완료
- [ ] `DATABASE_URL` 환경 변수 설정 완료
- [ ] 환경 변수가 모든 환경(Production, Preview, Development)에 적용됨
- [ ] Vercel에서 프로젝트 재배포 완료
- [ ] `/api/care-centers` 엔드포인트에서 요양원 목록 확인
- [ ] 회원가입 페이지에서 요양원 선택 드롭다운 작동 확인

---

## 🚨 문제 해결

### 문제 1: "데이터베이스 연결 오류" 메시지가 나타남
**해결 방법:**
1. `DATABASE_URL` 환경 변수가 올바르게 설정되었는지 확인
2. 데이터베이스가 "Active" 상태인지 확인
3. Connection String에 `?sslmode=require`가 포함되어 있는지 확인
4. Vercel에서 프로젝트를 재배포

### 문제 2: "존재하지 않는 요양원입니다" 오류
**해결 방법:**
1. 시드 데이터가 생성되었는지 확인 (`/api/care-centers` 접속)
2. 시드 데이터 생성 API 재실행
3. 데이터베이스에서 직접 확인:
   ```sql
   SELECT * FROM "CareCenter";
   ```

### 문제 3: 환경 변수가 적용되지 않음
**해결 방법:**
1. 환경 변수 설정 후 **반드시 프로젝트 재배포** 필요
2. Vercel 대시보드 → Deployments → 최신 배포의 "Redeploy" 클릭
3. 또는 GitHub에 새 커밋을 푸시하여 자동 재배포

### 문제 4: 시드 API가 작동하지 않음
**해결 방법:**
1. 프로덕션 환경에서는 시드 API가 비활성화될 수 있습니다
2. `ALLOW_SEED=true` 환경 변수 추가 (선택사항, 보안 주의)
3. 또는 로컬에서 Prisma CLI로 직접 시드 실행:
   ```bash
   npx prisma db seed
   ```

---

## 📞 추가 도움말

문제가 계속 발생하면:
1. Vercel 로그 확인: 프로젝트 → Deployments → 최신 배포 → Functions 로그
2. 브라우저 콘솔 확인: 개발자 도구(F12) → Console 탭
3. 네트워크 요청 확인: 개발자 도구 → Network 탭

---

## 🎯 빠른 요약

1. **Vercel Storage**에서 **Postgres** 생성
2. **Settings → Environment Variables**에서 `DATABASE_URL` 추가
3. 프로젝트 **재배포** 후 시드 데이터 생성

이제 회원가입이 정상적으로 작동할 것입니다! 🎉


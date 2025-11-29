# 🚀 삭제 후 재배포 가이드

## 삭제 완료 후 자동 재배포

프로젝트 삭제가 완료되면 다음 단계로 진행하세요.

## 📋 재배포 단계

### 1단계: 새 프로젝트 Import (2분)

1. **Vercel 대시보드**
   - https://vercel.com/dashboard 접속
   - "Add New..." → "Project" 클릭

2. **GitHub 저장소 선택**
   - `changleo79/caringnote` 선택
   - 또는 검색창에 `caringnote` 입력 후 선택
   - "Import" 클릭

3. **프로젝트 이름 설정**
   - **Project Name**: `caringnote` 입력
   - → URL: `https://caringnote.vercel.app` 자동 생성

### 2단계: 환경 변수 설정 ⚠️ 중요! (3분)

**"Environment Variables"** 섹션을 펼치고 다음 변수 추가:

#### 필수 환경 변수 3개

1. **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: 프로덕션 데이터베이스 URL
   - Environment: ✅ Production, ✅ Preview, ✅ Development
   - **참고**: 아직 데이터베이스가 없다면 임시 값 사용 가능:
     ```
     postgresql://temp:temp@localhost:5432/temp
     ```
     (나중에 실제 데이터베이스로 변경)

2. **NEXTAUTH_URL**
   - Key: `NEXTAUTH_URL`
   - Value: `https://caringnote.vercel.app`
   - Environment: ✅ Production, ✅ Preview, ✅ Development

3. **NEXTAUTH_SECRET**
   - Key: `NEXTAUTH_SECRET`
   - Value: 랜덤 문자열 (아래 생성)
   - Environment: ✅ Production, ✅ Preview, ✅ Development

#### NEXTAUTH_SECRET 생성

**온라인 생성기 (가장 쉬움):**
1. https://generate-secret.vercel.app/32 접속
2. 생성된 문자열 복사
3. 붙여넣기

**또는 PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 3단계: Build 설정 확인 (30초)

자동으로 감지되지만 확인:

- ✅ **Framework Preset**: Next.js
- ✅ **Root Directory**: `./`
- ✅ **Build Command**: `npm run build` (Prisma 포함됨)
- ✅ **Output Directory**: `.next`
- ✅ **Install Command**: `npm install`

### 4단계: Deploy! (2-3분)

1. 모든 설정 완료 확인
2. **"Deploy"** 버튼 클릭
3. 배포 진행 상황 확인
4. **"Ready"** 표시 확인

### 5단계: 데이터베이스 설정 (5분)

배포 완료 후 실제 데이터베이스 설정:

#### 방법 A: Vercel Postgres (권장, 가장 쉬움)

1. 프로젝트 대시보드 → **"Storage"** 탭 클릭
2. **"Create Database"** → **"Postgres"** 선택
3. Database Name: `caringnote-db` (또는 원하는 이름)
4. Region: `Seoul (icn1)` 선택
5. **"Create"** 클릭
6. 생성 완료 후:
   - `POSTGRES_URL` 환경 변수가 자동 추가됨
   - **Settings** → **Environment Variables**로 이동
   - `DATABASE_URL` 값 수정:
     - 기존 `DATABASE_URL` 편집
     - 값에 `POSTGRES_URL`과 동일한 값 입력
     - Save

#### 방법 B: Supabase (무료 옵션)

1. https://supabase.com 접속 및 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: `caringnote`
   - Database Password: (기억할 비밀번호)
   - Region: `Northeast Asia (Seoul)`
4. "Create new project" 클릭
5. 생성 완료 후:
   - Settings → Database
   - Connection string → "URI" 탭
   - 연결 문자열 복사
6. Vercel 환경 변수에 추가:
   - Key: `DATABASE_URL`
   - Value: 복사한 연결 문자열
   - Save

### 6단계: 데이터베이스 마이그레이션 (2분)

프로덕션 데이터베이스에 스키마 적용:

**로컬에서 실행:**

```powershell
# 1. 프로덕션 DATABASE_URL 설정
$env:DATABASE_URL="프로덕션_데이터베이스_URL"

# 2. 마이그레이션 실행
npx prisma db push

# 3. 성공 메시지 확인
```

**성공 메시지:**
```
Your database is now in sync with your Prisma schema.
```

### 7단계: 확인! (1분)

1. https://caringnote.vercel.app 접속
2. 홈페이지 표시 확인
3. 회원가입/로그인 페이지 접속 확인

## ✅ 재배포 체크리스트

배포 전:
- [ ] GitHub 저장소 `changleo79/caringnote` Import 완료
- [ ] Project Name: `caringnote` 설정
- [ ] `DATABASE_URL` 환경 변수 추가 (임시 값이라도)
- [ ] `NEXTAUTH_URL` 환경 변수 추가
- [ ] `NEXTAUTH_SECRET` 환경 변수 추가
- [ ] Build 설정 확인

배포 후:
- [ ] 배포 성공 확인
- [ ] 프로덕션 데이터베이스 생성 (Vercel Postgres 또는 Supabase)
- [ ] `DATABASE_URL` 실제 데이터베이스 URL로 업데이트
- [ ] 데이터베이스 마이그레이션 실행
- [ ] https://caringnote.vercel.app 접속 확인

## 🔄 자동 배포 설정

재배포 후 자동 배포가 설정됩니다:

- ✅ GitHub에 푸시하면 자동 재배포
- ✅ Pull Request마다 Preview 배포
- ✅ main 브랜치에 푸시하면 Production 배포

**테스트:**
```powershell
git add .
git commit -m "test: 재배포 테스트"
git push
```

## 🆘 문제 해결

### 빌드 실패

1. Build Logs 확인
2. 환경 변수 누락 확인
3. DATABASE_URL 확인

### 데이터베이스 오류

1. DATABASE_URL 정확한지 확인
2. 마이그레이션 실행 여부 확인
3. 데이터베이스 접근 권한 확인

## 📝 환경 변수 빠른 참조

| 변수명 | 값 | 생성 방법 |
|--------|-----|----------|
| `DATABASE_URL` | 프로덕션 DB URL | Vercel Postgres 또는 Supabase |
| `NEXTAUTH_URL` | `https://caringnote.vercel.app` | 직접 입력 |
| `NEXTAUTH_SECRET` | 랜덤 문자열 | https://generate-secret.vercel.app/32 |

---

**준비 완료! 삭제 후 위 단계를 따라 재배포하세요!** 🚀


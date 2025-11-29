# 🔧 배포 에러 해결 가이드

## 🔴 일반적인 배포 에러

### 1. 환경 변수 누락 오류

**증상:**
- `DATABASE_URL` is required
- `NEXTAUTH_SECRET` is missing
- Environment variable not found

**해결:**
Vercel 대시보드 → Settings → Environment Variables에서 다음 3개 추가:

```
DATABASE_URL=postgresql://temp:temp@localhost:5432/temp
NEXTAUTH_URL=https://caringnote.vercel.app
NEXTAUTH_SECRET=[생성한_비밀키]
```

### 2. Prisma 생성 오류

**증상:**
- `PrismaClient is not defined`
- `Cannot find module '@prisma/client'`
- `prisma generate` failed

**해결:**
현재 `package.json`에는 빌드 시 Prisma가 생성되도록 설정되어 있습니다:
```json
"build": "prisma generate && next build"
```

만약 여전히 오류가 발생한다면:
1. Vercel 대시보드 → Settings → Build & Development Settings
2. Build Command 확인:
   ```
   npm run build
   ```
3. 또는 직접:
   ```
   prisma generate && next build
   ```

### 3. 의존성 설치 오류

**증상:**
- `npm install` failed
- Package not found
- Version conflict

**해결:**
1. `package.json`의 의존성 버전 확인
2. `package-lock.json`이 있는지 확인
3. Vercel에서 Clean Install 사용

### 4. 빌드 타임아웃

**증상:**
- Build timeout
- Build taking too long

**해결:**
1. 빌드 최적화
2. 불필요한 의존성 제거

## 🛠️ 단계별 해결 방법

### Step 1: 환경 변수 확인

Vercel 대시보드에서:

1. **프로젝트 선택**
2. **Settings** → **Environment Variables**
3. 다음 3개가 있는지 확인:

| 변수명 | 값 예시 | 필수 |
|--------|---------|------|
| `DATABASE_URL` | `postgresql://...` | ✅ |
| `NEXTAUTH_URL` | `https://caringnote.vercel.app` | ✅ |
| `NEXTAUTH_SECRET` | 랜덤 문자열 | ✅ |

**없다면 추가:**
- Add 버튼 클릭
- Key: 변수명
- Value: 값
- Environment: Production, Preview, Development 모두 선택
- Save

### Step 2: 빌드 명령어 확인

Vercel 대시보드에서:

1. **Settings** → **General**
2. **Build & Development Settings** 섹션
3. **Build Command** 확인:
   ```
   npm run build
   ```
   
4. 만약 다르다면 수정:
   ```
   npm run build
   ```

### Step 3: Prisma 생성 확인

`package.json`의 build 스크립트 확인:
```json
"build": "prisma generate && next build"
```

이렇게 되어 있어야 Prisma가 빌드 전에 생성됩니다.

### Step 4: 재배포

환경 변수 추가/수정 후:

1. **Deployments** 탭
2. 최신 배포 클릭
3. **"Redeploy"** 버튼
4. 또는 GitHub에 빈 커밋 푸시:
   ```powershell
   git commit --allow-empty -m "trigger redeploy"
   git push
   ```

## 🔍 빌드 로그 확인

배포 실패 시:

1. Vercel 대시보드 → **Deployments**
2. 실패한 배포 클릭
3. **Build Logs** 탭
4. 오류 메시지 확인
5. 오류 내용을 알려주시면 정확한 해결책 제시

## 📋 체크리스트

- [ ] 환경 변수 3개 모두 추가됨
  - [ ] DATABASE_URL
  - [ ] NEXTAUTH_URL
  - [ ] NEXTAUTH_SECRET
- [ ] Build Command: `npm run build` 확인
- [ ] package.json의 build 스크립트 확인
- [ ] 빌드 로그에서 오류 메시지 확인

## 🆘 구체적인 오류 메시지 알려주세요

배포 에러의 정확한 원인을 파악하려면:

1. **빌드 로그 확인**
   - Vercel → Deployments → 실패한 배포 → Build Logs
   - 가장 아래쪽의 빨간색 오류 메시지 복사

2. **오류 메시지 공유**
   - 어떤 오류가 발생했는지 알려주세요
   - 그러면 정확한 해결책을 제시할 수 있습니다

## 💡 빠른 해결 방법

### 임시 DATABASE_URL 설정

실제 데이터베이스가 아직 없다면 임시 값 사용:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

빌드 시에는 실제 연결이 필요 없습니다. (런타임에만 필요)

### NEXTAUTH_SECRET 빠른 생성

온라인 생성기:
https://generate-secret.vercel.app/32

---

**어떤 오류 메시지가 나오는지 알려주시면 정확한 해결책을 제시하겠습니다!** 🔍


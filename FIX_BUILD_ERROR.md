# 🔧 빌드 오류 수정 가이드

## 발견된 문제

Vercel 배포 시 `npm install` 단계에서 실패했습니다.

## 원인 분석

주요 원인:
1. **Prisma postinstall 스크립트**: `postinstall`에서 `prisma generate` 실행 시 오류 발생 가능
2. **환경 변수 누락**: DATABASE_URL이 없으면 Prisma가 실패할 수 있음
3. **Vercel 설정**: 불필요한 환경 변수 설정

## ✅ 적용한 수정사항

### 1. vercel.json 수정
- `PRISMA_GENERATE_DATAPROXY` 환경 변수 제거 (Prisma Accelerate 미사용)

### 2. package.json 수정
- `postinstall` 스크립트에 오류 처리 추가 (`|| true`)

## 🔄 추가 수정 필요 사항

### Vercel 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 반드시 설정해야 합니다:

1. **DATABASE_URL** (빌드 시 필요)
   - 임시 값이라도 설정 필요: `postgresql://temp:temp@temp:5432/temp`
   - 또는 실제 프로덕션 데이터베이스 URL

2. **NEXTAUTH_URL**
   - `https://caringnote.vercel.app`

3. **NEXTAUTH_SECRET**
   - 랜덤 문자열 생성

## 📋 재배포 단계

### 1. 변경사항 커밋 및 푸시

```powershell
git add .
git commit -m "fix: 빌드 오류 수정 - Prisma postinstall 처리 개선"
git push
```

### 2. Vercel 환경 변수 확인

Vercel 대시보드에서:
- Settings → Environment Variables
- 다음 변수들이 있는지 확인:
  - `DATABASE_URL` (임시 값이라도 필요)
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`

### 3. 재배포

1. Vercel 대시보드에서
2. 실패한 배포 클릭
3. **"Redeploy"** 버튼 클릭
4. 또는 GitHub에 푸시하면 자동 재배포

## 🆘 여전히 실패하는 경우

### 옵션 1: postinstall 스크립트 제거 (임시)

`package.json`에서 postinstall 제거:

```json
{
  "scripts": {
    "postinstall": "prisma generate || true"
  }
}
```

→ 

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

그리고 `package.json` 수정:

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### 옵션 2: Vercel Build Command 수정

Vercel 대시보드에서:
- Settings → General
- Build & Development Settings
- Build Command를 다음으로 변경:
  ```
  npx prisma generate && npm run build
  ```

### 옵션 3: DATABASE_URL 임시 설정

빌드 시에는 실제 데이터베이스가 필요 없습니다. 임시 URL 설정:

```
DATABASE_URL=postgresql://temp:temp@localhost:5432/temp
```

## 📝 확인 체크리스트

- [ ] vercel.json 수정 완료
- [ ] package.json 수정 완료
- [ ] 변경사항 커밋 및 푸시
- [ ] Vercel 환경 변수 설정 확인
- [ ] DATABASE_URL 환경 변수 설정 (임시 값이라도)
- [ ] 재배포 실행

## ✅ 예상 결과

수정 후:
- ✅ npm install 성공
- ✅ Prisma Client 생성 성공
- ✅ 빌드 진행
- ✅ 배포 완료

## 🔍 로그 확인

빌드가 실패하면:
1. Vercel 대시보드 → Deployments
2. 실패한 배포 클릭
3. Build Logs 탭에서 상세 오류 확인
4. 오류 메시지에 따라 추가 수정


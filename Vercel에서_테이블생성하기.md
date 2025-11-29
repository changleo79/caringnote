# 🔧 Vercel에서 테이블 생성하기 (간단 방법)

## 문제
로컬 터미널에서 npm/node가 인식되지 않는 경우

## 해결 방법: API를 통해 테이블 생성

### 방법 1: API 엔드포인트 사용 (간단)

1. **브라우저 개발자 도구 열기** (F12)

2. **Console 탭**에서 다음 코드 실행:

```javascript
fetch('https://caringnote.vercel.app/api/migrate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

3. 결과 확인

---

### 방법 2: Vercel 대시보드에서 환경 변수 확인

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. `DATABASE_URL` 값을 복사

4. 프로젝트 폴더에 `.env.local` 파일 생성:
   ```
   DATABASE_URL=복사한_값_여기에_붙여넣기
   ```

5. 이제 로컬에서 마이그레이션 실행 가능

---

### 방법 3: Vercel에서 자동 마이그레이션 (권장)

빌드 시 자동으로 테이블을 생성하도록 설정:

`package.json`의 `build` 스크립트를 확인하세요:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postbuild": "prisma db push --skip-generate"
  }
}
```

이렇게 하면 배포할 때마다 자동으로 테이블이 생성됩니다.

---

## ✅ 추천: 빌드 시 자동 마이그레이션

`package.json` 수정:

```json
{
  "scripts": {
    "build": "prisma generate && prisma db push --skip-generate && next build"
  }
}
```

이렇게 하면:
- 배포할 때마다 테이블 자동 생성
- 수동 작업 불필요
- 안전하게 동작

---

## 🎯 빠른 해결

가장 빠른 방법:

1. `package.json`의 `build` 스크립트에 `prisma db push` 추가
2. GitHub에 푸시
3. Vercel에서 자동 배포
4. 배포 완료 후 테이블 생성됨!


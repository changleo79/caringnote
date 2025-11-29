# 🚀 빠른 데이터베이스 설정 가이드

## 3단계 요약

### ✅ 1단계: PostgreSQL 생성 (Vercel)
```
Vercel 대시보드 → 프로젝트 선택 → Storage → Create Database → Postgres 선택 → 생성
```

### ✅ 2단계: 환경 변수 설정
```
Settings → Environment Variables → DATABASE_URL 추가
(Storage에서 Connection String 복사해서 붙여넣기)
```

### ✅ 3단계: 시드 데이터 생성
```
방법 1: API 호출 (간단)
https://your-app.vercel.app/api/care-centers/seed 에 POST 요청

방법 2: 로컬에서 실행
npx prisma db push
npx prisma db seed
```

---

## 📝 상세 가이드
더 자세한 내용은 `DATABASE_SETUP_GUIDE.md` 파일을 참고하세요.


# ⚡ 배포 에러 빠른 해결 (5분)

## 🔴 가장 흔한 원인: 환경 변수 누락

배포 에러의 90%는 환경 변수가 없어서 발생합니다!

## ✅ 즉시 해결하기

### Step 1: Vercel 환경 변수 설정 (2분)

1. **Vercel 대시보드 접속**
   - 프로젝트 선택 (caringnote)

2. **Settings → Environment Variables**

3. **다음 3개 추가:**

#### 1️⃣ DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://temp:temp@localhost:5432/temp
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 2️⃣ NEXTAUTH_URL
```
Key: NEXTAUTH_URL
Value: https://caringnote.vercel.app
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 3️⃣ NEXTAUTH_SECRET
```
Key: NEXTAUTH_SECRET
Value: [생성 필요 - 아래 참조]
Environment: ✅ Production ✅ Preview ✅ Development
```

**NEXTAUTH_SECRET 생성:**
- 온라인: https://generate-secret.vercel.app/32
- 복사해서 붙여넣기

### Step 2: 재배포 (1분)

환경 변수 추가 후:

1. **Deployments 탭**
2. 최신 배포 클릭
3. **"Redeploy"** 버튼 클릭
4. 또는 Settings → General → "Redeploy" 버튼

### Step 3: 확인 (2분)

배포가 진행되는 동안:
- Build Logs 확인
- 성공하면 "Ready" 표시
- 실패하면 오류 메시지 확인

## 🔍 여전히 실패한다면

### 빌드 로그 확인

1. Vercel → Deployments
2. 실패한 배포 클릭
3. **Build Logs** 탭
4. 맨 아래 빨간색 오류 메시지 확인
5. 오류 내용을 알려주세요!

## 📋 체크리스트

- [ ] DATABASE_URL 환경 변수 추가됨
- [ ] NEXTAUTH_URL 환경 변수 추가됨
- [ ] NEXTAUTH_SECRET 환경 변수 추가됨
- [ ] 재배포 실행
- [ ] 빌드 로그 확인

## 💡 팁

**임시 DATABASE_URL 사용 가능:**
실제 데이터베이스가 없어도 빌드는 가능합니다:
```
postgresql://temp:temp@localhost:5432/temp
```

나중에 실제 데이터베이스로 변경하면 됩니다.

---

**환경 변수만 추가하면 대부분 해결됩니다!** 🚀


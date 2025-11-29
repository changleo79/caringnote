# 🔧 데이터베이스 연결 오류 해결 가이드

## 🚨 현재 상황
이미지에서 확인된 오류:
- **"This project is already connected to the target store in one of the chosen environments"**
- 이미 데이터베이스가 일부 환경에 연결되어 있습니다.

## ✅ 해결 방법

### 방법 1: 기존 연결 확인 및 환경 변수 사용 (추천)

이미 연결이 되어 있다면, 환경 변수가 자동으로 생성되었을 수 있습니다.

#### 1단계: 환경 변수 확인
1. Vercel 프로젝트 대시보드에서 **"Settings"** 탭 클릭
2. 왼쪽 사이드바에서 **"Environment Variables"** 클릭
3. 다음 환경 변수들을 확인하세요:
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL`
   - `DATABASE_URL`
   - 또는 `STORAGE_URL` (커스텀 프리픽스를 사용한 경우)

#### 2단계: DATABASE_URL 확인
환경 변수 목록에서 `DATABASE_URL`이 있는지 확인:
- ✅ **있으면**: 이미 설정되어 있습니다!
- ❌ **없으면**: 다음 단계로 진행

#### 3단계: DATABASE_URL 추가
1. **"Add New"** 버튼 클릭
2. **Key**: `DATABASE_URL` 입력
3. **Value**: `POSTGRES_PRISMA_URL` 또는 `POSTGRES_URL` 값을 복사해서 붙여넣기
   - (이미 자동 생성된 환경 변수 중 하나의 값을 사용)
4. **Environment**: Production, Preview, Development 모두 체크
5. **"Save"** 클릭

#### 4단계: 재배포
1. **"Deployments"** 탭 클릭
2. 최신 배포의 **"..."** 메뉴 → **"Redeploy"**
3. 배포 완료 대기

---

### 방법 2: 기존 연결 해제 후 재연결

모달을 취소하고, 다른 방법으로 진행:

#### 1단계: Storage 페이지 확인
1. **"Storage"** 탭에서 데이터베이스가 보이는지 확인
2. 데이터베이스 이름 클릭 (예: "caringnote" 또는 "prisma-postgres")

#### 2단계: 연결 정보 확인
1. 데이터베이스 페이지에서 **"Settings"** 또는 **"Connection Info"** 섹션 확인
2. **Connection String** 또는 **DATABASE_URL** 복사

#### 3단계: 환경 변수 직접 추가
1. 프로젝트 **"Settings"** → **"Environment Variables"**
2. **"Add New"** 클릭
3. **Key**: `DATABASE_URL`
4. **Value**: 복사한 Connection String 붙여넣기
5. 모든 환경 체크 후 **"Save"**

#### 4단계: 재배포
1. **"Deployments"** → 최신 배포 **"Redeploy"**

---

## 🔍 현재 상태 확인 방법

### 1. 환경 변수 확인
```
Settings → Environment Variables
```
다음 중 하나라도 있으면 연결된 것입니다:
- `DATABASE_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL`
- `STORAGE_URL`

### 2. 데이터베이스 상태 확인
```
Storage 탭 → 데이터베이스 클릭
```
- Status: **"Available"** 또는 **"Active"** 여야 함
- Created: 언제 생성되었는지 확인

### 3. API 테스트
배포 후 다음 URL로 테스트:
```
https://your-app.vercel.app/api/care-centers
```
- 빈 배열 `[]` 반환 = 연결됨, 데이터 없음 (정상)
- 오류 메시지 = 연결 실패

---

## 💡 추천 순서

1. **먼저**: Settings → Environment Variables에서 `DATABASE_URL` 확인
2. **없으면**: Storage에서 Connection String 복사해서 직접 추가
3. **재배포**: Deployments → Redeploy
4. **시드 데이터 생성**: `/api/care-centers/seed` 호출

---

## 🆘 여전히 문제가 있나요?

### "이미 연결되어 있다" 오류가 계속 나타나요?
→ 모달을 **"Cancel"**하고, Storage 페이지에서 직접 Connection String을 복사해서 환경 변수로 추가하세요.

### 환경 변수가 보이지 않아요?
→ Storage 탭 → 데이터베이스 클릭 → Settings/Connection Info에서 Connection String 확인

### 연결은 되어 있는데 회원가입이 안 돼요?
→ 시드 데이터를 생성해야 합니다! `/api/care-centers/seed` 호출하세요.

---

**가장 간단한 방법**: Storage에서 Connection String 복사 → Settings → Environment Variables → DATABASE_URL 추가 → 재배포!


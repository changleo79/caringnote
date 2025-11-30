# 🚀 마이그레이션 API 사용법

## 📋 새로운 마이그레이션 API

프로그래밍 방식으로 마이그레이션을 실행할 수 있는 API를 만들었습니다.

---

## 🔍 현재 상태 확인

### 브라우저에서 확인

```
GET https://caringnote.vercel.app/api/migrate-schema
```

또는 브라우저 콘솔에서:

```javascript
fetch('/api/migrate-schema')
  .then(r => r.json())
  .then(console.log)
```

**응답 예시:**
```json
{
  "message": "마이그레이션 상태 확인",
  "tables": {
    "ResidentFamily": false,
    "Notification": false
  },
  "allTablesExist": false
}
```

---

## 🚀 마이그레이션 실행

### 방법 1: 브라우저 콘솔에서 실행

1. **사이트 접속**: https://caringnote.vercel.app
2. **F12** 눌러서 개발자 도구 열기
3. **Console 탭**에서 다음 코드 실행:

```javascript
fetch('/api/migrate-schema', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => {
  console.log('✅ 마이그레이션 결과:', data);
  if (data.success) {
    alert('마이그레이션 완료!\n\n' + data.steps.join('\n'));
  } else {
    alert('오류 발생:\n\n' + data.errors.join('\n'));
  }
})
.catch(err => {
  console.error('❌ 오류:', err);
  alert('마이그레이션 실행 중 오류가 발생했습니다.');
});
```

### 방법 2: VS Code REST Client 또는 Postman

```
POST https://caringnote.vercel.app/api/migrate-schema
Content-Type: application/json
```

---

## ⚠️ 프로덕션 환경

프로덕션에서는 보안상 `ALLOW_MIGRATE` 환경 변수가 필요합니다.

### Vercel에서 환경 변수 설정

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 다음 추가:
   - Key: `ALLOW_MIGRATE`
   - Value: `true`
4. 재배포

또는 Vercel 빌드 시 자동으로 마이그레이션이 실행됩니다 (`package.json`의 `build` 스크립트 참고).

---

## ✅ 마이그레이션 확인

### 1. 상태 확인 API 호출

```javascript
fetch('/api/migrate-schema')
  .then(r => r.json())
  .then(data => {
    if (data.allTablesExist) {
      console.log('✅ 모든 테이블이 생성되었습니다!');
    } else {
      console.log('⚠️ 일부 테이블이 없습니다:', data.tables);
    }
  });
```

### 2. 앱에서 확인

다음 페이지가 정상 작동하면 마이그레이션 완료:
- `/profile/edit` - 프로필 수정
- `/residents` - 입소자 관리
- `/notifications` - 알림

---

## 🎯 실행 순서

1. **상태 확인**
   ```
   GET /api/migrate-schema
   ```

2. **마이그레이션 실행**
   ```
   POST /api/migrate-schema
   ```

3. **재확인**
   ```
   GET /api/migrate-schema
   ```

---

## 💡 빠른 실행 (한 번에)

브라우저 콘솔에서:

```javascript
(async () => {
  // 1. 상태 확인
  console.log('📋 현재 상태 확인 중...');
  const status = await fetch('/api/migrate-schema').then(r => r.json());
  console.log('현재 상태:', status);
  
  if (status.allTablesExist) {
    console.log('✅ 이미 모든 테이블이 생성되어 있습니다!');
    return;
  }
  
  // 2. 마이그레이션 실행
  console.log('🚀 마이그레이션 실행 중...');
  const result = await fetch('/api/migrate-schema', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }).then(r => r.json());
  
  console.log('결과:', result);
  
  if (result.success) {
    console.log('✅ 마이그레이션 완료!');
    console.log('생성된 항목:');
    result.steps.forEach(step => console.log('  -', step));
  } else {
    console.error('❌ 오류 발생:');
    result.errors.forEach(err => console.error('  -', err));
  }
  
  // 3. 재확인
  console.log('\n📋 최종 상태 확인 중...');
  const finalStatus = await fetch('/api/migrate-schema').then(r => r.json());
  console.log('최종 상태:', finalStatus);
})();
```

---

**브라우저 콘솔에서 위 코드를 실행하면 마이그레이션이 완료됩니다!** 🚀


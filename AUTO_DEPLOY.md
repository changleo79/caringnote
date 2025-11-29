# ⚡ 자동 배포 설정 완료

## ✅ 자동 배포 활성화

앞으로 모든 배포와 실행 작업은 **자동으로** 진행됩니다!

## 🚀 자동 배포 방법

### 방법 1: npm 스크립트 사용 (가장 간단)

```powershell
npm run deploy
```

이 명령어가 자동으로:
1. ✅ 모든 변경사항 추가 (`git add .`)
2. ✅ 커밋 생성 (자동 메시지)
3. ✅ GitHub에 푸시
4. ✅ Vercel 자동 재배포 트리거

### 방법 2: 커스텀 메시지와 함께

```powershell
npm run deploy:msg "커밋 메시지"
```

### 방법 3: 스크립트 직접 실행

**Windows:**
```powershell
.\scripts\auto-deploy.ps1
```

**Mac/Linux:**
```bash
chmod +x scripts/auto-deploy.sh
./scripts/auto-deploy.sh
```

## 📋 자동 배포 프로세스

1. **변경사항 확인** - 변경된 파일 체크
2. **자동 스테이징** - `git add .`
3. **자동 커밋** - 타임스탬프 포함 메시지
4. **자동 푸시** - GitHub에 업로드
5. **자동 재배포** - Vercel이 감지하여 배포

## ⚡ 사용 예시

### 일상적인 작업 후

```powershell
# 코드 수정 후
npm run deploy
# → 자동으로 배포 완료!
```

### 기능 추가 후

```powershell
npm run deploy:msg "feat: 커뮤니티 기능 추가"
```

### 버그 수정 후

```powershell
npm run deploy:msg "fix: 로그인 오류 수정"
```

## 🔄 Vercel 자동 배포

GitHub에 푸시하면:
- ✅ Vercel이 자동으로 변경 감지
- ✅ 자동으로 빌드 시작
- ✅ 자동으로 재배포
- ✅ 배포 완료 알림

## 💡 주의사항

- ⚠️ **변경사항이 없으면** 배포를 건너뜁니다
- ⚠️ **커밋 실패 시** 중단됩니다
- ✅ **푸시 실패 시** 업스트림 자동 설정

## 📚 추가 정보

- GitHub 저장소: `changleo79/caringnote`
- Vercel 대시보드: https://vercel.com/dashboard
- 프로젝트 URL: https://caringnote.vercel.app

---

**이제 `npm run deploy` 한 번이면 끝!** 🚀


# GitHub에 푸시하기

## 현재 상태

✅ 로컬 Git 저장소 준비 완료
- 첫 커밋 완료
- 원격 저장소 설정 완료: `https://github.com/changleo79/caringnote.git`

## GitHub 저장소 생성 및 푸시

### 1단계: GitHub에서 저장소 생성

1. https://github.com/new 접속
2. 다음 정보 입력:
   - **Owner**: changleo79
   - **Repository name**: `caringnote`
   - **Description**: "요양원 케어 플랫폼 - 부모님의 안전하고 따뜻한 생활을 위한 통합 소통 플랫폼"
   - **Visibility**: Public 또는 Private 선택
   - ⚠️ **"Add a README file" 체크하지 마세요** (이미 있음)
   - ⚠️ **"Add .gitignore" 체크하지 마세요** (이미 있음)
   - ⚠️ **"Choose a license" 선택하지 마세요**

3. **Create repository** 클릭

### 2단계: GitHub에 푸시

저장소 생성 후 PowerShell에서 다음 명령어 실행:

```powershell
git push -u origin main
```

### 3단계: 인증 (필요한 경우)

#### 방법 1: Personal Access Token 사용 (권장)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" 클릭
3. Note: "caringnote push" 입력
4. Expiration: 원하는 기간 선택
5. 권한 선택: `repo` 체크 (전체 체크박스 클릭)
6. "Generate token" 클릭
7. 생성된 토큰 복사 (한 번만 표시됨!)
8. 푸시 시:
   - Username: `changleo79`
   - Password: 생성한 토큰 붙여넣기

#### 방법 2: GitHub CLI 사용

```powershell
# GitHub CLI 설치 (없는 경우)
winget install GitHub.cli

# 로그인
gh auth login

# 푸시
git push -u origin main
```

#### 방법 3: SSH 키 사용

```powershell
# SSH 키 생성 (없는 경우)
ssh-keygen -t ed25519 -C "your-email@example.com"

# 공개 키 복사
cat ~/.ssh/id_ed25519.pub

# GitHub에 SSH 키 추가:
# GitHub → Settings → SSH and GPG keys → New SSH key

# 원격 저장소 URL을 SSH로 변경
git remote set-url origin git@github.com:changleo79/caringnote.git

# 푸시
git push -u origin main
```

## ✅ 확인

푸시가 성공하면:

1. https://github.com/changleo79/caringnote 접속
2. 모든 파일이 업로드되었는지 확인
3. README.md가 정상적으로 표시되는지 확인

## 🔄 이후 작업

푸시 후에는 자동으로 연결됩니다. 다음부터는:

```powershell
git add .
git commit -m "변경 내용 설명"
git push
```

만으로 업로드할 수 있습니다.

## 🆘 문제 해결

### "Repository not found" 오류
- GitHub 저장소가 생성되었는지 확인
- 저장소 이름이 정확한지 확인: `caringnote`

### "Authentication failed" 오류
- Personal Access Token을 사용하세요
- 토큰에 `repo` 권한이 있는지 확인

### "Permission denied" 오류
- 저장소에 대한 접근 권한이 있는지 확인
- 저장소가 Private인 경우, 계정이 저장소에 접근 권한이 있는지 확인

## 📞 도움말

- [GitHub 공식 문서](https://docs.github.com/)
- [Personal Access Token 생성 가이드](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)


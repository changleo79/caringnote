# GitHub 저장소 설정 가이드

## 📋 단계별 설정 방법

### 1단계: GitHub 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단의 **+** 버튼 클릭 → **New repository** 선택
3. 저장소 정보 입력:
   - **Repository name**: `care-app` (또는 원하는 이름)
   - **Description**: "요양원 케어 플랫폼 - 부모님의 안전하고 따뜻한 생활을 위한 통합 소통 플랫폼"
   - **Visibility**: Private (또는 Public)
   - ⚠️ **"Initialize this repository with a README"는 체크하지 마세요** (이미 파일이 있으므로)
4. **Create repository** 클릭

### 2단계: 로컬 Git 저장소 초기화 및 연결

프로젝트 폴더에서 다음 명령어를 실행하세요:

#### Windows (PowerShell)

```powershell
# 1. Git 초기화 (아직 안 했다면)
git init

# 2. 모든 파일 추가
git add .

# 3. 첫 커밋
git commit -m "Initial commit: 요양원 케어 플랫폼 프로젝트 시작"

# 4. GitHub 저장소 연결 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/care-app.git

# 5. 기본 브랜치를 main으로 설정
git branch -M main

# 6. GitHub에 푸시
git push -u origin main
```

#### Mac/Linux (Terminal)

```bash
# 1. Git 초기화 (아직 안 했다면)
git init

# 2. 모든 파일 추가
git add .

# 3. 첫 커밋
git commit -m "Initial commit: 요양원 케어 플랫폼 프로젝트 시작"

# 4. GitHub 저장소 연결 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/care-app.git

# 5. 기본 브랜치를 main으로 설정
git branch -M main

# 6. GitHub에 푸시
git push -u origin main
```

### 3단계: 인증 확인

첫 푸시 시 GitHub 인증이 필요할 수 있습니다:

- **Personal Access Token 사용 권장**:
  1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. "Generate new token" 클릭
  3. 필요한 권한 선택 (repo 권한 필요)
  4. 생성된 토큰을 비밀번호 대신 사용

또는 GitHub CLI 사용:

```bash
# GitHub CLI 설치 후
gh auth login
```

### 4단계: 확인

GitHub 저장소 페이지에서 모든 파일이 업로드되었는지 확인하세요!

## 🔄 이후 변경사항 업로드

개발 중 변경사항을 업로드할 때:

```bash
# 1. 변경된 파일 확인
git status

# 2. 파일 추가
git add .

# 3. 커밋
git commit -m "설명: 변경 내용 요약"

# 4. GitHub에 푸시
git push
```

## 🌿 브랜치 사용하기

새 기능을 개발할 때:

```bash
# 새 브랜치 생성
git checkout -b feature/기능명

# 개발 후 커밋
git add .
git commit -m "feat: 새 기능 추가"

# 브랜치 푸시
git push -u origin feature/기능명

# GitHub에서 Pull Request 생성
```

## ⚠️ 주의사항

1. **환경 변수 파일은 절대 커밋하지 마세요**
   - `.env.local` 파일은 `.gitignore`에 포함되어 있습니다
   - `.env.local.example`만 커밋됩니다

2. **민감한 정보 확인**
   - API 키, 비밀번호 등은 환경 변수로 관리
   - 절대 코드에 하드코딩하지 마세요

3. **.gitignore 확인**
   - `node_modules`, `.next`, `.env.local` 등은 자동으로 제외됩니다

## 📚 추가 리소스

- [Git 기본 사용법](https://git-scm.com/book/ko/v2)
- [GitHub 가이드](https://guides.github.com/)


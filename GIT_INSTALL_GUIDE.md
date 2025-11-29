# Git 설치 가이드 (Windows)

현재 시스템에 Git이 설치되어 있지 않거나 PATH에 등록되지 않은 것으로 확인되었습니다.

## 🚀 Git 설치 방법

### 방법 1: 공식 Git for Windows 설치 (권장)

1. **다운로드**
   - [Git for Windows 공식 사이트](https://git-scm.com/download/win) 접속
   - 또는 직접 다운로드: https://github.com/git-for-windows/git/releases/latest
   - `Git-2.x.x-64-bit.exe` 파일 다운로드

2. **설치**
   - 다운로드한 `.exe` 파일 실행
   - 설치 마법사에서 **기본 설정으로 진행** 권장:
     - ✅ Git from the command line and also from 3rd-party software
     - ✅ Use bundled OpenSSH
     - ✅ Use the OpenSSL library
     - ✅ Checkout Windows-style, commit Unix-style line endings
     - ✅ Use MinTTY (the default terminal of MSYS2)
   - 나머지는 기본값으로 **Next** 클릭

3. **설치 확인**
   - PowerShell을 **새로 열기** (중요!)
   - 다음 명령어 실행:
   ```powershell
   git --version
   ```
   - 버전 정보가 표시되면 설치 완료!

### 방법 2: Winget 사용 (Windows 10/11)

```powershell
winget install --id Git.Git -e --source winget
```

### 방법 3: Chocolatey 사용

```powershell
choco install git
```

## ✅ 설치 확인

PowerShell을 **새로 열고** 다음 명령어로 확인:

```powershell
git --version
```

예상 출력: `git version 2.x.x.windows.x`

## ⚠️ 주의사항

1. **PowerShell 재시작 필요**
   - Git 설치 후 기존 PowerShell 창은 닫고 새로 열어야 합니다
   - 또는 새 터미널 창을 열어주세요

2. **환경 변수 PATH**
   - 대부분의 경우 자동으로 PATH에 추가됩니다
   - 만약 여전히 작동하지 않으면:
     - Git 설치 경로 확인: `C:\Program Files\Git\bin\`
     - 환경 변수 PATH에 수동 추가

## 🔧 설치 후 해야 할 일

### 1. Git 사용자 정보 설정

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. 기본 브랜치 이름 설정

```powershell
git config --global init.defaultBranch main
```

### 3. 자격 증명 관리자 설정 (선택사항)

GitHub와 사용하기 편하게:

```powershell
git config --global credential.helper manager-core
```

## 📚 다음 단계

Git 설치가 완료되면:

1. **프로젝트 Git 초기화**
   ```powershell
   cd "C:\Users\82103\Desktop\cursor\care app"
   git init
   ```

2. **GitHub 설정 가이드 참조**
   - [GITHUB_SETUP.md](./GITHUB_SETUP.md) 파일을 확인하세요

3. **자동화 스크립트 사용**
   ```powershell
   .\scripts\init-git.ps1
   ```

## 🆘 문제 해결

### Git이 여전히 인식되지 않는 경우

1. **PowerShell 재시작 확인**
   - 완전히 닫고 새로 열기

2. **수동 PATH 추가**
   ```powershell
   # PATH 확인
   $env:Path
   
   # Git 경로 추가 (임시)
   $env:Path += ";C:\Program Files\Git\bin"
   
   # 확인
   git --version
   ```

3. **시스템 재부팅**
   - 환경 변수 변경이 적용되지 않는 경우

4. **Git 재설치**
   - 제어판에서 Git 제거 후 재설치

## 💡 추가 리소스

- [Git 공식 문서](https://git-scm.com/doc)
- [Git for Windows 위키](https://github.com/git-for-windows/git/wiki)
- [GitHub Desktop](https://desktop.github.com/) - GUI 도구 (선택사항)

## ✨ 빠른 설치 링크

- **Git for Windows 최신 버전**: https://git-scm.com/download/win
- **GitHub Desktop** (GUI): https://desktop.github.com/

설치 후 PowerShell을 재시작하고 `git --version`으로 확인해주세요!


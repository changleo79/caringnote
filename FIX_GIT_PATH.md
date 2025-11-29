# Git PATH 문제 해결

Git이 설치되어 있지만 (`C:\Program Files\Git\bin\`) PATH 환경 변수에 등록되지 않아 명령어로 바로 사용할 수 없는 상황입니다.

## ✅ 확인됨

- Git 버전: **2.52.0.windows.1**
- 설치 위치: `C:\Program Files\Git\bin\`
- 상태: 설치됨, PATH에 등록 필요

## 🔧 해결 방법

### 방법 1: PowerShell에서 임시로 사용 (현재 세션만)

현재 PowerShell 창에서는 이미 PATH에 추가되어 있습니다. 이 창에서는 `git` 명령어를 바로 사용할 수 있습니다.

### 방법 2: PATH를 영구적으로 추가 (권장)

#### Windows 설정에서 추가

1. **시작 메뉴**에서 "환경 변수" 검색
2. **시스템 환경 변수 편집** 선택
3. **환경 변수** 버튼 클릭
4. **시스템 변수**에서 `Path` 선택 → **편집** 클릭
5. **새로 만들기** 클릭
6. 다음 경로 추가: `C:\Program Files\Git\bin`
7. **확인** 클릭하여 모든 창 닫기
8. **PowerShell 재시작**

#### PowerShell에서 영구적으로 추가 (관리자 권한 필요)

```powershell
# 관리자 권한으로 PowerShell 실행 후
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\Program Files\Git\bin",
    "Machine"
)
```

### 방법 3: 현재 세션에서만 사용 (임시)

```powershell
# 현재 PowerShell 세션에만 추가
$env:Path += ";C:\Program Files\Git\bin"
```

## ✅ 확인

새 PowerShell 창에서:

```powershell
git --version
```

버전 정보가 표시되면 성공!

## 📝 참고

- PATH에 추가하지 않아도 전체 경로로 사용 가능:
  ```powershell
  & "C:\Program Files\Git\bin\git.exe" --version
  ```
- 하지만 편의를 위해 PATH에 추가하는 것을 권장합니다.


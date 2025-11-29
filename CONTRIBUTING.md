# 기여 가이드

요양원 케어 플랫폼 프로젝트에 기여해주셔서 감사합니다!

## 개발 환경 설정

1. 저장소 클론
```bash
git clone https://github.com/YOUR_USERNAME/care-app.git
cd care-app
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.local.example .env.local
# .env.local 파일 편집
```

4. 데이터베이스 초기화
```bash
npm run db:generate
npm run db:push
```

5. 개발 서버 실행
```bash
npm run dev
```

## 코드 스타일

- TypeScript 사용
- ESLint 규칙 준수
- Prettier 포맷팅 (향후 추가 예정)
- 컴포넌트는 재사용 가능하도록 설계

## 커밋 메시지

명확하고 의미 있는 커밋 메시지를 작성해주세요:

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 설정 변경
```

## Pull Request

1. 새로운 브랜치 생성
```bash
git checkout -b feature/your-feature-name
```

2. 변경사항 커밋
```bash
git add .
git commit -m "feat: 기능 설명"
```

3. 푸시 및 PR 생성
```bash
git push origin feature/your-feature-name
```

## 질문 및 지원

문제가 발생하거나 질문이 있으시면 GitHub Issues를 통해 문의해주세요.


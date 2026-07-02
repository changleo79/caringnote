# Supabase 설정 가이드

실버노트는 Supabase PostgreSQL과 Storage를 사용합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에서 새 프로젝트 생성
2. Region: `Northeast Asia (Seoul)` 권장
3. Database password 저장

## 2. 연결 문자열 설정

Supabase Dashboard → **Settings** → **Database** → **Connection string**

| 변수 | 용도 | 포트 |
|------|------|------|
| `DATABASE_URL` | 앱 런타임 (Prisma) | 6543 (Transaction pooler) |
| `DIRECT_URL` | 마이그레이션 (Prisma) | 5432 (Direct) |

`.env.local` 예시:

```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
```

> Cloud Agent VM은 IPv6 direct host(`db.*.supabase.co`)에 접근할 수 없으므로 **pooler(aws-1)** 를 사용합니다.

## 3. 스키마 적용

```bash
npm run db:generate
npm run db:push
npm run db:seed   # 선택: 초기 데이터
```

## 4. Storage 버킷 설정

Supabase Dashboard → **Storage** → **New bucket**

- Bucket name: `uploads`
- Public bucket: **Yes** (이미지 공개 URL 필요)

RLS 정책 (SQL Editor에서 실행):

```sql
-- 인증된 사용자만 업로드
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');

-- 모든 사용자가 이미지 조회 가능
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'uploads');
```

서버 사이드 업로드는 `SUPABASE_SERVICE_ROLE_KEY`를 사용하므로 RLS를 우회합니다.

## 5. 환경 변수 (Vercel)

Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL
DIRECT_URL
NEXTAUTH_URL=https://silver-note.vercel.app
NEXTAUTH_SECRET
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## 6. SQL Editor vs Pooler 연결

SQL Editor에서 쿼리가 성공해도 **외부 pooler 연결이 실패**할 수 있습니다. SQL Editor는 Supabase 내부 경로를 사용하고, Prisma/Vercel은 pooler URI가 필요합니다.

`password authentication failed for user "postgres"` 오류 시:

1. **Settings → Database → Reset database password** (영문+숫자만 권장, `!@#` 등 특수문자는 URI 파싱 문제를 일으킬 수 있음)
2. **Settings → General → Restart project** (pooler 비밀번호 캐시 동기화)
3. 상단 **Connect** 버튼 → **ORM** 또는 **URI** 탭에서 connection string **전체 복사**
4. `DATABASE_URL`(6543), `DIRECT_URL`(5432)에 붙여넣기

로컬/CI에서 pooler 연결 테스트:

```bash
SUPABASE_DB_PASSWORD='your-password' SUPABASE_SERVICE_ROLE_KEY='...' npm run setup:env
```

## 7. 연결 확인

앱 실행 후 `/api/db-check` 엔드포인트로 DB 연결 상태를 확인할 수 있습니다.

새 Supabase 기준: CareCenter 3, User 0. Vercel production이 예전 DB(User 2)를 가리키면 환경 변수를 갱신하고 재배포하세요.

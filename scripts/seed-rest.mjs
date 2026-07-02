#!/usr/bin/env node
/** REST API로 시드 데이터 삽입 (Prisma pooler 연결 불가 시 fallback) */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://febqrvjexshypkjdvjgt.supabase.co'
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY required')
  process.exit(1)
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

const careCenters = [
  { id: 'seed-happy-001', name: '행복 요양원', address: '서울특별시 강남구 테헤란로 123', phone: '02-1234-5678', email: 'info@happy-care.co.kr', description: '가족처럼 따뜻하게 모시는 요양원입니다.' },
  { id: 'seed-love-002', name: '사랑 요양원', address: '서울특별시 서초구 서초대로 456', phone: '02-2345-6789', email: 'contact@love-care.co.kr', description: '진심으로 정성스럽게 돌봐드립니다.' },
  { id: 'seed-peace-003', name: '평화 요양원', address: '서울특별시 송파구 올림픽로 789', phone: '02-3456-7890', email: 'peace@care.co.kr', description: '안전하고 편안한 환경을 제공합니다.' },
]

async function upsertCareCenter(data) {
  const check = await fetch(`${SUPABASE_URL}/rest/v1/CareCenter?name=eq.${encodeURIComponent(data.name)}&select=id,name`, { headers })
  const existing = await check.json()
  if (Array.isArray(existing) && existing.length > 0) {
    console.log(`⚠️  "${data.name}" 이미 존재`)
    return existing[0]
  }

  const now = new Date().toISOString()
  const res = await fetch(`${SUPABASE_URL}/rest/v1/CareCenter`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...data, createdAt: now, updatedAt: now }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Insert failed for ${data.name}: ${err}`)
  }

  const created = await res.json()
  console.log(`✅ "${data.name}" 생성 완료`)
  return created[0]
}

async function main() {
  console.log('🌱 REST API 시드 시작...')
  for (const c of careCenters) {
    await upsertCareCenter(c)
  }
  console.log('✅ 시드 완료')
}

main().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})

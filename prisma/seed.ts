import { PrismaClient, UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 실버노트 데모 시드 시작...")

  const center = await prisma.careCenter.upsert({
    where: { homepageSlug: "happy-care" },
    update: { name: "행복 요양원" },
    create: {
      id: "seed-center-happy",
      name: "행복 요양원",
      address: "서울특별시 강남구 테헤란로 123",
      phone: "02-1234-5678",
      email: "info@happy-care.co.kr",
      description: "가족처럼 따뜻하게 모시는 요양원입니다.",
      homepageSlug: "happy-care",
    },
  })

  await prisma.careCenter.upsert({
    where: { id: "seed-love-002" },
    update: {},
    create: {
      id: "seed-love-002",
      name: "사랑 요양원",
      address: "서울특별시 서초구 서초대로 456",
      phone: "02-2345-6789",
      email: "contact@love-care.co.kr",
      description: "진심으로 정성스럽게 돌봐드립니다.",
      homepageSlug: "love-care",
    },
  })

  const password = await bcrypt.hash("demo1234!", 10)

  const staff = await prisma.user.upsert({
    where: { email: "staff@silver-note.kr" },
    update: { careCenterId: center.id, role: UserRole.CAREGIVER },
    create: {
      email: "staff@silver-note.kr",
      password,
      name: "김보호",
      role: UserRole.CAREGIVER,
      careCenterId: center.id,
      phone: "010-1111-2222",
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: "admin@silver-note.kr" },
    update: { careCenterId: center.id, role: UserRole.ADMIN },
    create: {
      email: "admin@silver-note.kr",
      password,
      name: "이시설",
      role: UserRole.ADMIN,
      careCenterId: center.id,
      phone: "010-3333-4444",
    },
  })

  const family = await prisma.user.upsert({
    where: { email: "family@silver-note.kr" },
    update: { careCenterId: center.id, role: UserRole.FAMILY },
    create: {
      email: "family@silver-note.kr",
      password,
      name: "박자녀",
      role: UserRole.FAMILY,
      careCenterId: center.id,
      phone: "010-5555-6666",
    },
  })

  const r1 = await prisma.resident.upsert({
    where: { id: "seed-resident-1" },
    update: {},
    create: {
      id: "seed-resident-1",
      name: "김영희",
      roomNumber: "301",
      gender: "F",
      birthDate: new Date("1942-03-12"),
      careCenterId: center.id,
      statusChip: "GOOD",
      notes: "산책을 좋아하십니다.",
    },
  })
  const r2 = await prisma.resident.upsert({
    where: { id: "seed-resident-2" },
    update: {},
    create: {
      id: "seed-resident-2",
      name: "이철수",
      roomNumber: "205",
      gender: "M",
      birthDate: new Date("1938-11-02"),
      careCenterId: center.id,
      statusChip: "OK",
    },
  })
  const r3 = await prisma.resident.upsert({
    where: { id: "seed-resident-3" },
    update: {},
    create: {
      id: "seed-resident-3",
      name: "박순자",
      roomNumber: "112",
      gender: "F",
      birthDate: new Date("1945-07-21"),
      careCenterId: center.id,
      statusChip: "CAUTION",
    },
  })

  await prisma.residentFamily.upsert({
    where: { residentId_userId: { residentId: r1.id, userId: family.id } },
    update: { isApproved: true, familyRole: "PRIMARY" },
    create: {
      residentId: r1.id,
      userId: family.id,
      relationship: "자녀",
      familyRole: "PRIMARY",
      isApproved: true,
      approvedById: admin.id,
      approvedAt: new Date(),
    },
  })

  await prisma.emergencyContact.createMany({
    data: [
      { residentId: r1.id, name: "박자녀", phone: "010-5555-6666", relation: "자녀", priority: 1 },
      { residentId: r1.id, name: "김동생", phone: "010-7777-8888", relation: "자녀", priority: 2 },
    ],
    skipDuplicates: true,
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.menuPlan.upsert({
    where: { careCenterId_date: { careCenterId: center.id, date: today } },
    update: {
      breakfast: "죽, 김치, 계란말이",
      lunch: "생선구이, 된장찌개, 나물",
      dinner: "불고기, 미역국, 밥",
      snack: "과일",
    },
    create: {
      careCenterId: center.id,
      date: today,
      breakfast: "죽, 김치, 계란말이",
      lunch: "생선구이, 된장찌개, 나물",
      dinner: "불고기, 미역국, 밥",
      snack: "과일",
    },
  })

  const existingReport = await prisma.dailyReport.findUnique({
    where: { magicToken: "demo-magic-token-kimyounghee" },
  })
  if (!existingReport) {
    await prisma.dailyReport.create({
      data: {
        careCenterId: center.id,
        residentId: r1.id,
        authorId: staff.id,
        content: "오늘 산책을 다녀오셨어요. 식사도 잘 하시고 기분이 좋으셨습니다.",
        moodChip: "GOOD",
        chips: JSON.stringify(["meal", "walk", "goodMood"]),
        isDraft: false,
        publishedAt: new Date(),
        magicToken: "demo-magic-token-kimyounghee",
      },
    })
  }

  const existingAnnouncement = await prisma.announcement.findFirst({
    where: { careCenterId: center.id, title: "3월 가족 면회 안내" },
  })
  if (!existingAnnouncement) {
    await prisma.announcement.create({
      data: {
        careCenterId: center.id,
        authorId: admin.id,
        title: "3월 가족 면회 안내",
        content: "면회는 평일 10시~16시, 주말 10시~17시입니다. 실버노트에서 미리 예약해 주세요.",
      },
    })
  }

  const existingMedical = await prisma.medicalRecord.findFirst({
    where: { residentId: r1.id, title: "정기 혈압 측정" },
  })
  if (!existingMedical) {
    await prisma.medicalRecord.create({
      data: {
        title: "정기 혈압 측정",
        content: "수축기 128 / 이완기 78. 특이사항 없음.",
        plainExplain: "혈압이 안정적이에요.",
        recordDate: new Date(),
        category: "Exam",
        residentId: r1.id,
        createdById: staff.id,
      },
    })
  }

  const existingMed = await prisma.medicationSchedule.findFirst({
    where: { residentId: r1.id, name: "혈압약" },
  })
  if (!existingMed) {
    await prisma.medicationSchedule.create({
      data: {
        residentId: r1.id,
        name: "혈압약",
        dosage: "1정",
        schedule: "아침 식후",
      },
    })
  }

  const existingPlan = await prisma.carePlan.findFirst({
    where: { residentId: r1.id, title: "주간 케어 플랜" },
  })
  if (!existingPlan) {
    await prisma.carePlan.create({
      data: {
        careCenterId: center.id,
        residentId: r1.id,
        authorId: admin.id,
        title: "주간 케어 플랜",
        content: "매일 오전 산책 권장, 수분 섭취 확인, 저녁 수면 전 스트레칭.",
      },
    })
  }

  await prisma.product.createMany({
    data: [
      {
        name: "성인용 기저귀 (중형)",
        description: "부드러운 흡수 기저귀 20매",
        price: 28900,
        stock: 50,
        category: "Daily",
        careCenterId: center.id,
      },
      {
        name: "영양 두유",
        description: "고칼슘 두유 24팩",
        price: 15900,
        stock: 30,
        category: "Food",
        careCenterId: center.id,
      },
    ],
    skipDuplicates: true,
  })

  await prisma.handoverNote.create({
    data: {
      careCenterId: center.id,
      authorId: staff.id,
      shift: "주간→야간",
      content: "301호 김영희 어르신 산책 후 무릎 불편 호소. 야간 시 주의 관찰 부탁드립니다.",
    },
  })

  console.log("✅ 시드 완료")
  console.log("  시설:", center.name)
  console.log("  직원: staff@silver-note.kr / demo1234!")
  console.log("  관리: admin@silver-note.kr / demo1234!")
  console.log("  가족: family@silver-note.kr / demo1234!")
  console.log("  어르신:", r1.name, r2.name, r3.name)
}

main()
  .catch((e) => {
    console.error("❌ 시드 실패:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

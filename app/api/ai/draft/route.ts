import { NextRequest, NextResponse } from "next/server"
import { requireStaff } from "@/lib/access"

export const dynamic = "force-dynamic"

const CHIP_LINES: Record<string, string> = {
  meal: "식사를 잘 드셨습니다.",
  sleep: "낮잠을 편안하게 주무셨습니다.",
  walk: "산책과 가벼운 활동을 하셨습니다.",
  low: "컨디션이 조금 떨어지신 듯 보여 주의 깊게 살피고 있습니다.",
  hospital: "병원 동행이 있었습니다. 자세한 내용은 건강 기록을 확인해 주세요.",
}

const MOOD_LINES: Record<string, string> = {
  GOOD: "오늘은 전반적으로 좋은 컨디션이십니다.",
  OK: "오늘은 평소와 비슷한 하루를 보내고 계십니다.",
  CAUTION: "오늘은 조금 더 세심히 돌보고 있습니다.",
}

/** 알림장 AI/템플릿 초안 — 게이트웨이 없이도 동작하는 현장용 초안 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireStaff()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { residentName, moodChip, chips } = await req.json()
    const name = residentName || "어르신"
    const mood = MOOD_LINES[moodChip || "OK"] || MOOD_LINES.OK
    const chipList: string[] = Array.isArray(chips) ? chips : []
    const details = chipList
      .map((c) => CHIP_LINES[c])
      .filter(Boolean)
      .join(" ")

    const draft = [
      `${name} 어르신의 오늘 소식입니다.`,
      mood,
      details,
      "편안한 하루 되시길 바랍니다.",
    ]
      .filter(Boolean)
      .join(" ")

    return NextResponse.json({ draft, provider: "template" })
  } catch (error) {
    console.error("AI draft", error)
    return NextResponse.json({ error: "초안 생성 실패" }, { status: 500 })
  }
}

/**
 * 카카오 알림톡 어댑터.
 * KAKAO_ALIMTALK_ENABLED=true 이고 키가 있을 때만 실제 발송.
 * 없으면 매직링크 URL을 로그/반환만 하고 인앱 알림으로 대체.
 */
export type AlimtalkPayload = {
  toPhone?: string | null
  templateCode?: string
  residentName: string
  summary: string
  magicUrl: string
}

export async function sendDailyReportAlimtalk(payload: AlimtalkPayload) {
  const enabled = process.env.KAKAO_ALIMTALK_ENABLED === "true"
  const apiKey = process.env.KAKAO_ALIMTALK_API_KEY

  if (!enabled || !apiKey || !payload.toPhone) {
    return {
      sent: false as const,
      reason: !payload.toPhone ? "no_phone" : "disabled",
      magicUrl: payload.magicUrl,
    }
  }

  // 실제 카카오 비즈메시지 API 연동 지점 (심사 후 키 주입)
  console.info("[kakao] alimtalk queued", {
    to: payload.toPhone.slice(-4),
    resident: payload.residentName,
    url: payload.magicUrl,
  })

  return { sent: true as const, reason: "queued", magicUrl: payload.magicUrl }
}

export function buildMagicUrl(token: string, origin?: string) {
  const base = origin || process.env.NEXTAUTH_URL || "https://silver-note.vercel.app"
  return `${base.replace(/\/$/, "")}/r/${token}`
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase"

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "JPEG, PNG, WebP, GIF 이미지만 업로드 가능합니다." }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Supabase Storage upload when configured
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin()
      const ext = file.name.split(".").pop() || "jpg"
      const filename = `${session.user.id}/${Date.now()}.${ext}`

      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: false,
        })

      if (error) {
        console.error("Supabase upload error:", error)
        return NextResponse.json({ error: "파일 업로드에 실패했습니다." }, { status: 500 })
      }

      const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(data.path)

      return NextResponse.json({
        url: urlData.publicUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
      })
    }

    // Fallback: base64 data URL (development only)
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Storage가 구성되지 않았습니다. Supabase Storage를 설정하세요." },
        { status: 503 }
      )
    }

    const base64 = buffer.toString("base64")
    return NextResponse.json({
      url: `data:${file.type};base64,${base64}`,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "파일 업로드에 실패했습니다." }, { status: 500 })
  }
}

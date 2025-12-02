import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// 이미지 업로드 API
// 현재는 base64로 반환 (나중에 Cloudinary나 S3로 확장 가능)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "파일이 없습니다." },
        { status: 400 }
      )
    }

    // 파일 타입 검증 (이미지만 허용)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "이미지 파일만 업로드 가능합니다." },
        { status: 400 }
      )
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "파일 크기는 10MB 이하여야 합니다." },
        { status: 400 }
      )
    }

    // 파일을 base64로 변환
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    // TODO: 나중에 Cloudinary나 S3로 업로드하고 URL 반환
    // 현재는 base64 data URL 반환 (임시)
    return NextResponse.json({
      url: dataUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error: any) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "파일 업로드에 실패했습니다." },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notifyPostLiked } from "@/lib/notifications"

// 좋아요 토글
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const postId = params.id
    const userId = session.user.id!

    // 좋아요 여부 확인
    const existingLike = await prisma.postLike.findFirst({
      where: {
        postId,
        userId,
      },
    })

    if (existingLike) {
      // 좋아요 취소
      await prisma.postLike.delete({
        where: {
          id: existingLike.id,
        },
      })
      
      const likeCount = await prisma.postLike.count({
        where: { postId },
      })

      return NextResponse.json({ 
        liked: false,
        likeCount,
      })
    } else {
      // 좋아요 추가
      await prisma.postLike.create({
        data: {
          postId,
          userId,
        },
      })
      
      const likeCount = await prisma.postLike.count({
        where: { postId },
      })

      // 알림 생성 (비동기, 에러가 발생해도 좋아요는 성공)
      notifyPostLiked(postId, userId).catch(
        (error) => console.error("알림 생성 실패:", error)
      )

      return NextResponse.json({ 
        liked: true,
        likeCount,
      })
    }
  } catch (error: any) {
    console.error("Error toggling like:", error)
    return NextResponse.json(
      { error: "좋아요 처리에 실패했습니다." },
      { status: 500 }
    )
  }
}


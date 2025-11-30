import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/notifications"

// 댓글 목록 조회
export async function GET(
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

    const comments = await prisma.comment.findMany({
      where: {
        postId: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(comments)
  } catch (error: any) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "댓글을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

// 댓글 작성
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

    const body = await req.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "댓글 내용을 입력해주세요." },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: params.id,
        authorId: session.user.id!,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    })

    // 게시글 작성자에게 댓글 알림 (본인 댓글이 아닌 경우)
    try {
      const post = await prisma.post.findUnique({
        where: { id: params.id },
        select: { authorId: true },
      })

      if (post && post.authorId !== session.user.id) {
        await createNotification({
          userId: post.authorId,
          type: "CommentCreated",
          title: `${comment.author.name}님이 댓글을 남겼습니다`,
          content: content.trim().substring(0, 50),
          relatedId: params.id,
          relatedType: "Post",
        })
      }
    } catch (error) {
      console.error("Error creating notification:", error)
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error: any) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "댓글 작성에 실패했습니다." },
      { status: 500 }
    )
  }
}


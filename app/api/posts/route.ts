import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createNotificationForResidentFamily, createNotificationForCareCenter } from "@/lib/notifications"

// 게시글 목록 조회
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const searchParams = req.nextUrl.searchParams
    const careCenterId = searchParams.get("careCenterId") || session.user.careCenterId

    if (!careCenterId) {
      return NextResponse.json(
        { error: "요양원 정보가 필요합니다." },
        { status: 400 }
      )
    }

    const posts = await prisma.post.findMany({
      where: {
        careCenterId: careCenterId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        resident: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    // 좋아요 여부 확인
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const isLiked = await prisma.postLike.findFirst({
          where: {
            postId: post.id,
            userId: session.user.id!,
          },
        })

        return {
          ...post,
          images: post.images ? JSON.parse(post.images) : [],
          isLiked: !!isLiked,
        }
      })
    )

    return NextResponse.json(postsWithLikes)
  } catch (error: any) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "게시글을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

// 게시글 작성
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { title, content, images, residentId, category } = body

    if (!session.user.careCenterId) {
      return NextResponse.json(
        { error: "요양원 정보가 필요합니다." },
        { status: 400 }
      )
    }

    // 이미지 배열을 JSON 문자열로 변환
    const imagesJson = images && Array.isArray(images) 
      ? JSON.stringify(images) 
      : null

    const post = await prisma.post.create({
      data: {
        title: title || null,
        content: content || null,
        images: imagesJson,
        careCenterId: session.user.careCenterId,
        residentId: residentId || null,
        authorId: session.user.id!,
        category: category || "Daily",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        resident: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // 알림 생성
    try {
      if (residentId) {
        // 입소자와 연결된 가족들에게 알림
        await createNotificationForResidentFamily(residentId, {
          type: "PostCreated",
          title: `${post.resident?.name || "입소자"}님의 새로운 게시글이 올라왔습니다`,
          content: post.title || post.content?.substring(0, 50) || "",
          relatedId: post.id,
          relatedType: "Post",
        })
      } else {
        // 요양원 전체 회원에게 알림
        await createNotificationForCareCenter(session.user.careCenterId, {
          type: "PostCreated",
          title: `${post.author.name}님이 새 게시글을 작성했습니다`,
          content: post.title || post.content?.substring(0, 50) || "",
          relatedId: post.id,
          relatedType: "Post",
        })
      }
    } catch (error) {
      console.error("Error creating notification:", error)
      // 알림 생성 실패해도 게시글은 성공적으로 생성되도록 함
    }

    return NextResponse.json({
      ...post,
      images: post.images ? JSON.parse(post.images) : [],
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "게시글 작성에 실패했습니다." },
      { status: 500 }
    )
  }
}


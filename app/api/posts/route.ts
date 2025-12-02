import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
      // CAREGIVER인 경우 안내 메시지
      if (session.user.role === "CAREGIVER") {
        return NextResponse.json(
          { error: "요양원 정보를 먼저 설정해주세요. 대시보드에서 '요양원 정보' 메뉴를 이용하세요." },
          { status: 400 }
        )
      }
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
      // CAREGIVER인 경우 안내 메시지
      if (session.user.role === "CAREGIVER") {
        return NextResponse.json(
          { error: "요양원 정보를 먼저 설정해주세요. 대시보드에서 '요양원 정보' 메뉴를 이용하세요." },
          { status: 400 }
        )
      }
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
        careCenterId: careCenterId,
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


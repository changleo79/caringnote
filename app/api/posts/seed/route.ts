import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PostCategory, UserRole } from "@prisma/client"

// 테스트용 게시글과 댓글 생성
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // 관리자만 실행 가능하도록 (또는 개발 환경에서만)
    if (process.env.NODE_ENV === 'production' && session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      )
    }

    // 모든 사용자 가져오기
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: [UserRole.CAREGIVER, UserRole.FAMILY]
        }
      },
      include: {
        careCenter: true
      }
    })

    if (users.length === 0) {
      return NextResponse.json(
        { error: "사용자가 없습니다." },
        { status: 400 }
      )
    }

    // 모든 요양원 가져오기
    const careCenters = await prisma.careCenter.findMany()
    
    if (careCenters.length === 0) {
      return NextResponse.json(
        { error: "요양원이 없습니다." },
        { status: 400 }
      )
    }

    // 입소자 가져오기
    const residents = await prisma.resident.findMany({
      take: 10
    })

    const createdPosts: any[] = []
    const createdComments: any[] = []

    // 각 사용자별로 게시글 작성
    for (const user of users) {
      const userCareCenterId = user.careCenterId || careCenters[0].id
      
      // 사용자당 3-5개의 게시글 작성
      const postCount = Math.floor(Math.random() * 3) + 3
      
      for (let i = 0; i < postCount; i++) {
        const categories = [PostCategory.Daily, PostCategory.Medical, PostCategory.Event, PostCategory.Announcement]
        const category = categories[Math.floor(Math.random() * categories.length)]
        
        const titles = [
          "오늘의 일상",
          "부모님 건강 상태",
          "요양원 행사 안내",
          "식사 시간",
          "산책 나들이",
          "의료진 방문",
          "가족 면회",
          "생일 축하",
          "건강 체크",
          "일상 공유"
        ]
        
        const contents = [
          "오늘도 건강하게 하루를 보내고 계십니다.",
          "식사도 잘 드시고 계시네요.",
          "오늘 날씨가 좋아서 산책을 나갔습니다.",
          "의료진이 방문하여 건강 체크를 해주셨습니다.",
          "가족분들이 면회 오셔서 즐거운 시간을 보냈습니다.",
          "생일 축하 파티를 열었습니다.",
          "오늘도 활기찬 하루였습니다.",
          "새로운 활동을 시작했습니다.",
          "건강 상태가 양호합니다.",
          "일상의 소소한 행복을 공유합니다."
        ]

        const title = titles[Math.floor(Math.random() * titles.length)]
        const content = contents[Math.floor(Math.random() * contents.length)]
        
        // 랜덤하게 입소자 연결
        const resident = residents.length > 0 && Math.random() > 0.3 
          ? residents[Math.floor(Math.random() * residents.length)]
          : null

        try {
          const post = await prisma.post.create({
            data: {
              title: category === PostCategory.Announcement ? title : null,
              content: `${content} (작성자: ${user.name})`,
              images: null,
              careCenterId: userCareCenterId,
              residentId: resident?.id || null,
              authorId: user.id,
              category: category,
            },
          })

          createdPosts.push(post)

          // 각 게시글에 2-4개의 댓글 작성
          const commentCount = Math.floor(Math.random() * 3) + 2
          const commentUsers = users.filter(u => u.id !== user.id).slice(0, commentCount)
          
          const commentTexts = [
            "좋아요!",
            "건강하게 지내시는 모습이 보기 좋습니다.",
            "감사합니다.",
            "잘 지내고 계시는군요.",
            "응원합니다!",
            "좋은 하루 보내세요.",
            "건강하세요!",
            "항상 감사합니다.",
            "잘 보고 있습니다.",
            "좋은 소식이네요."
          ]

          for (const commentUser of commentUsers) {
            const commentText = commentTexts[Math.floor(Math.random() * commentTexts.length)]
            
            try {
              const comment = await prisma.comment.create({
                data: {
                  content: `${commentText} (${commentUser.name})`,
                  postId: post.id,
                  authorId: commentUser.id,
                },
              })
              
              createdComments.push(comment)
            } catch (commentError) {
              console.error("댓글 생성 오류:", commentError)
            }
          }
        } catch (postError) {
          console.error("게시글 생성 오류:", postError)
        }
      }
    }

    return NextResponse.json({
      message: "테스트 데이터 생성 완료",
      stats: {
        users: users.length,
        careCenters: careCenters.length,
        residents: residents.length,
        postsCreated: createdPosts.length,
        commentsCreated: createdComments.length,
      },
      posts: createdPosts.slice(0, 10), // 처음 10개만 반환
    })
  } catch (error: any) {
    console.error("Error seeding posts:", error)
    return NextResponse.json(
      { 
        error: "테스트 데이터 생성에 실패했습니다.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}


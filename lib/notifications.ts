import { prisma } from "@/lib/prisma"
import { NotificationType } from "@prisma/client"

/**
 * 알림 생성 유틸리티 함수
 */
export async function createNotification(data: {
  type: NotificationType
  title: string
  content?: string
  userId: string
  relatedId?: string
  relatedType?: string
}) {
  try {
    return await prisma.notification.create({
      data: {
        type: data.type,
        title: data.title,
        content: data.content || null,
        userId: data.userId,
        relatedId: data.relatedId || null,
        relatedType: data.relatedType || null,
      },
    })
  } catch (error) {
    console.error("알림 생성 오류:", error)
    return null
  }
}

/**
 * 게시글 작성 시 알림 생성
 * 같은 요양원의 모든 가족 회원에게 알림 전송
 */
export async function notifyPostCreated(postId: string, authorId: string, careCenterId: string) {
  try {
    // 같은 요양원의 가족 회원들 조회 (작성자 제외)
    const familyMembers = await prisma.user.findMany({
      where: {
        careCenterId: careCenterId,
        role: "FAMILY",
        id: { not: authorId },
      },
    })

    // 게시글 정보 조회
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { name: true } },
        resident: { select: { name: true } },
      },
    })

    if (!post) return

    const title = post.resident
      ? `${post.resident.name}님의 새 게시글이 올라왔습니다`
      : "새 게시글이 올라왔습니다"
    const content = post.content
      ? `${post.author.name}님이 게시글을 작성했습니다: ${post.content.substring(0, 50)}${post.content.length > 50 ? "..." : ""}`
      : `${post.author.name}님이 게시글을 작성했습니다`

    // 각 가족 회원에게 알림 생성
    const notifications = await Promise.all(
      familyMembers.map((member) =>
        createNotification({
          type: NotificationType.PostCreated,
          title,
          content,
          userId: member.id,
          relatedId: postId,
          relatedType: "Post",
        })
      )
    )

    return notifications.filter(Boolean)
  } catch (error) {
    console.error("게시글 알림 생성 오류:", error)
    return []
  }
}

/**
 * 댓글 작성 시 알림 생성
 * 게시글 작성자에게 알림 전송 (댓글 작성자 제외)
 */
export async function notifyCommentCreated(commentId: string, postId: string, authorId: string) {
  try {
    // 게시글 정보 조회
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, name: true } },
      },
    })

    if (!post || post.authorId === authorId) {
      // 게시글 작성자가 댓글을 단 경우 알림 없음
      return null
    }

    // 댓글 정보 조회
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: { select: { name: true } },
      },
    })

    if (!comment) return null

    return await createNotification({
      type: NotificationType.CommentCreated,
      title: `${comment.author.name}님이 댓글을 남겼습니다`,
      content: comment.content.substring(0, 100),
      userId: post.authorId,
      relatedId: postId,
      relatedType: "Post",
    })
  } catch (error) {
    console.error("댓글 알림 생성 오류:", error)
    return null
  }
}

/**
 * 게시글 좋아요 시 알림 생성
 * 게시글 작성자에게 알림 전송 (좋아요 누른 사람 제외)
 */
export async function notifyPostLiked(postId: string, userId: string) {
  try {
    // 게시글 정보 조회
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, name: true } },
      },
    })

    if (!post || post.authorId === userId) {
      // 게시글 작성자가 좋아요를 누른 경우 알림 없음
      return null
    }

    // 좋아요한 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    })

    if (!user) return null

    return await createNotification({
      type: NotificationType.PostLiked,
      title: `${user.name}님이 게시글에 좋아요를 눌렀습니다`,
      content: null,
      userId: post.authorId,
      relatedId: postId,
      relatedType: "Post",
    })
  } catch (error) {
    console.error("좋아요 알림 생성 오류:", error)
    return null
  }
}

/**
 * 의료 기록 생성 시 알림 생성
 * 해당 입소자의 가족 회원들에게 알림 전송
 */
export async function notifyMedicalRecordCreated(
  recordId: string,
  residentId: string,
  createdById: string
) {
  try {
    // 입소자의 가족 회원들 조회
    const families = await prisma.residentFamily.findMany({
      where: {
        residentId: residentId,
        isApproved: true,
      },
      include: {
        user: { select: { id: true } },
      },
    })

    // 의료 기록 정보 조회
    const record = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
      include: {
        resident: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
    })

    if (!record) return []

    const title = `${record.resident.name}님의 새 의료 기록이 등록되었습니다`
    const content = `${record.createdBy.name}님이 의료 기록을 작성했습니다: ${record.title}`

    // 각 가족 회원에게 알림 생성
    const notifications = await Promise.all(
      families.map((family) =>
        createNotification({
          type: NotificationType.MedicalRecordCreated,
          title,
          content,
          userId: family.user.id,
          relatedId: recordId,
          relatedType: "MedicalRecord",
        })
      )
    )

    return notifications.filter(Boolean)
  } catch (error) {
    console.error("의료 기록 알림 생성 오류:", error)
    return []
  }
}


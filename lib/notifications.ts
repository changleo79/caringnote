import { prisma } from "./prisma"
import { NotificationType } from "@prisma/client"

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  content?: string
  relatedId?: string
  relatedType?: string
}

/**
 * 알림 생성 헬퍼 함수
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        content: params.content || null,
        relatedId: params.relatedId || null,
        relatedType: params.relatedType || null,
        isRead: false,
      },
    })

    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    return null
  }
}

/**
 * 여러 사용자에게 알림 생성
 */
export async function createNotificationsForUsers(
  userIds: string[],
  params: Omit<CreateNotificationParams, "userId">
) {
  try {
    const notifications = await Promise.all(
      userIds.map((userId) =>
        createNotification({
          ...params,
          userId,
        })
      )
    )

    return notifications.filter((n) => n !== null)
  } catch (error) {
    console.error("Error creating notifications for users:", error)
    return []
  }
}

/**
 * 요양원의 모든 회원에게 알림 생성
 */
export async function createNotificationForCareCenter(
  careCenterId: string,
  params: Omit<CreateNotificationParams, "userId">
) {
  try {
    const users = await prisma.user.findMany({
      where: {
        careCenterId,
      },
      select: {
        id: true,
      },
    })

    const userIds = users.map((u) => u.id)
    return await createNotificationsForUsers(userIds, params)
  } catch (error) {
    console.error("Error creating notification for care center:", error)
    return []
  }
}

/**
 * 입소자와 연결된 모든 가족에게 알림 생성
 */
export async function createNotificationForResidentFamily(
  residentId: string,
  params: Omit<CreateNotificationParams, "userId">
) {
  try {
    const residentFamilies = await prisma.residentFamily.findMany({
      where: {
        residentId,
        isApproved: true,
      },
      select: {
        userId: true,
      },
    })

    const userIds = residentFamilies.map((rf) => rf.userId)
    return await createNotificationsForUsers(userIds, params)
  } catch (error) {
    console.error("Error creating notification for resident family:", error)
    return []
  }
}


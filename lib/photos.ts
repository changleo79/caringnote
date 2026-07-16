/**
 * Curated editorial set.
 * Photos are used only on marketing/auth empty contexts — never as fake user content.
 */
export const PHOTOS = {
  hero:
    "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=2400&q=88",
  auth:
    "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1800&q=88",
} as const

export const PHOTO_ALT = {
  hero: "햇살이 드는 생활 공간에서 일상을 보내는 어르신",
  auth: "밝은 생활 공간에서 이어지는 돌봄",
} as const

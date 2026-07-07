export const USER_ROLES = {
  TUTOR: "Tutor",
  ADMIN_CENTRO: "AdminCentro",
  SUPER_ADMIN: "SuperAdmin",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const ALL_ROLES = Object.values(USER_ROLES)

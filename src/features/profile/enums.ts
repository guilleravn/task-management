export const USER_TYPE_VALUES = ['ADMIN', 'CANDIDATE'] as const
export type UserType = (typeof USER_TYPE_VALUES)[number]

export const USER_TYPE_LABELS: Record<UserType, string> = {
  ADMIN: 'Admin',
  CANDIDATE: 'Candidate',
}

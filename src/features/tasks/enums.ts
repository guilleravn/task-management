// Narrows untrusted input (e.g. a URL param) to one of an enum's values.
export function isOneOf<T extends string>(values: readonly T[], raw: string | null): raw is T {
  return raw !== null && (values as readonly string[]).includes(raw)
}

export const STATUS_VALUES =['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'] as const
export type Status = (typeof STATUS_VALUES)[number]

export const STATUS_LABELS: Record<Status, string> = {
  BACKLOG: 'Backlog',
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  CANCELLED: 'Cancelled',
}

export const TASK_TAG_VALUES = ['ANDROID', 'IOS', 'NODE_JS', 'RAILS', 'REACT'] as const
export type TaskTag = (typeof TASK_TAG_VALUES)[number]

export const TASK_TAG_LABELS: Record<TaskTag, string> = {
  ANDROID: 'Android',
  IOS: 'iOS',
  NODE_JS: 'Node.js',
  RAILS: 'Rails',
  REACT: 'React',
}

export const TASK_TAG_COLOR_VARS: Record<TaskTag, string> = {
  ANDROID: '--tag-android',
  IOS: '--tag-ios',
  NODE_JS: '--tag-node-js',
  RAILS: '--tag-rails',
  REACT: '--tag-react',
}

export const POINT_ESTIMATE_VALUES = ['ZERO', 'ONE', 'TWO', 'FOUR', 'EIGHT'] as const
export type PointEstimate = (typeof POINT_ESTIMATE_VALUES)[number]

export const POINT_ESTIMATE_LABELS: Record<PointEstimate, number> = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  FOUR: 4,
  EIGHT: 8,
}

import type { PointEstimate, Status, TaskTag } from './enums'

export interface User {
  id: string
  fullName: string
  avatar: string | null
}

export type TaskAssignee = User

export interface Task {
  id: string
  name: string
  status: Status
  tags: TaskTag[]
  dueDate: string
  pointEstimate: PointEstimate
  position: number
  assignee: TaskAssignee | null
}

export interface FilterTaskInput {
  assigneeId?: string
  dueDate?: string
  name?: string
  ownerId?: string
  pointEstimate?: PointEstimate
  status?: Status
  tags?: TaskTag[]
}

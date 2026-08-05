import type { PointEstimate, Status, TaskTag } from './enums'

export interface TaskAssignee {
  id: string
  fullName: string
  avatar: string | null
}

export interface Task {
  id: string
  name: string
  status: Status
  tags: TaskTag[]
  dueDate: string
  pointEstimate: PointEstimate
  assignee: TaskAssignee | null
}

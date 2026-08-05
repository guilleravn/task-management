import { gql, type TypedDocumentNode } from '@apollo/client'
import type { Task } from '../types'
import type { Status, TaskTag, PointEstimate } from '../enums'

export interface CreateTaskInput {
  name: string
  status: Status
  tags: TaskTag[]
  dueDate: string
  pointEstimate: PointEstimate
  assigneeId?: string
}

export interface CreateTaskResult {
  createTask: Task
}

export interface CreateTaskVariables {
  input: CreateTaskInput
}

export const CREATE_TASK: TypedDocumentNode<CreateTaskResult, CreateTaskVariables> = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      name
      status
      tags
      dueDate
      pointEstimate
      assignee {
        id
        fullName
        avatar
      }
    }
  }
`

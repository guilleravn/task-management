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
      position
      assignee {
        id
        fullName
        avatar
      }
    }
  }
`

export interface UpdateTaskInput {
  id: string
  name?: string
  status?: Status
  tags?: TaskTag[]
  dueDate?: string
  pointEstimate?: PointEstimate
  position?: number
  assigneeId?: string
}

export interface UpdateTaskResult {
  updateTask: Task
}

export interface UpdateTaskVariables {
  input: UpdateTaskInput
}

export const UPDATE_TASK: TypedDocumentNode<UpdateTaskResult, UpdateTaskVariables> = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      name
      status
      tags
      dueDate
      pointEstimate
      position
      assignee {
        id
        fullName
        avatar
      }
    }
  }
`

export interface DeleteTaskInput {
  id: string
}

export interface DeleteTaskResult {
  deleteTask: Task
}

export interface DeleteTaskVariables {
  input: DeleteTaskInput
}

export const DELETE_TASK: TypedDocumentNode<DeleteTaskResult, DeleteTaskVariables> = gql`
  mutation DeleteTask($input: DeleteTaskInput!) {
    deleteTask(input: $input) {
      id
    }
  }
`

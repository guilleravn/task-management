import { gql, type TypedDocumentNode } from '@apollo/client'
import type { Task, FilterTaskInput, User } from '../types'

export interface GetTasksResult {
  tasks: Task[]
}

export interface GetTasksVariables {
  input: FilterTaskInput
}

export const GET_TASKS: TypedDocumentNode<GetTasksResult, GetTasksVariables> = gql`
  query GetTasks($input: FilterTaskInput!) {
    tasks(input: $input) {
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

export interface GetUsersResult {
  users: User[]
}

export const GET_USERS: TypedDocumentNode<GetUsersResult> = gql`
  query GetUsers {
    users {
      id
      fullName
      avatar
    }
  }
`

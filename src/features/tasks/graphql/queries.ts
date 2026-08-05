import { gql, type TypedDocumentNode } from '@apollo/client'
import type { Task, FilterTaskInput } from '../types'

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
      assignee {
        id
        fullName
        avatar
      }
    }
  }
`

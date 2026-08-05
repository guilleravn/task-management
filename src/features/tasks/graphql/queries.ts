import { gql } from '@apollo/client'

export const GET_TASKS = gql`
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

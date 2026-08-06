import { gql, type TypedDocumentNode } from '@apollo/client'
import type { Profile } from '../types'

export interface GetProfileResult {
  profile: Profile
}

export const GET_PROFILE: TypedDocumentNode<GetProfileResult> = gql`
  query GetProfile {
    profile {
      id
      fullName
      email
      type
      avatar
      createdAt
      updatedAt
    }
  }
`

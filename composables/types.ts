import type {
  CommunityInput,
  GroupInput,
  PerformerInput,
  SchoolInput,
  TeacherInput,
} from '~/graphql/gql/graphql'

export enum StatusEnum {
  null,
  removed,
  saved,
  pending,
}

export interface Status {
  [key: string]: StatusEnum
}

export interface ErrorCounts {
  [key: string]: number
}

export type ContactInfo = PerformerInput &
  TeacherInput &
  GroupInput &
  CommunityInput &
  SchoolInput

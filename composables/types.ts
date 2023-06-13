import type {
  CommunityInput,
  GroupInput,
  PerformerInput,
  SchoolInput,
  TeacherInput,
} from '~/graphql/gql/graphql'

export enum StatusEnum {
  null,
  saved,
  saving,
}

export interface Status {
  [key: string]: StatusEnum
}

export type ContactInfo = PerformerInput &
  TeacherInput &
  GroupInput &
  CommunityInput &
  SchoolInput

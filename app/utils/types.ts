import type {
  CommunityInput,
  GroupInput,
  PerformerInput,
  Performer,
  Group,
  School,
  SchoolGroup,
  Community,
  CommunityGroup,
  Teacher,
  RegisteredClass,
  PerformerType,
  RegistrationInput,
  User,
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

export interface ClassErrors {
  id: number
  count: number
  selections: {
    id: number
    count: number
  }[]
}

export interface EmailPayload {
  performers: Performer[]
  teacher: Partial<Teacher>
  group: Group
  school?: Partial<School>
  schoolGroups?: SchoolGroup[]
  community?: Partial<Community>
  communityGroups?: CommunityGroup[]
  registeredClasses: RegisteredClass[]
  performerType: PerformerType
  paymentType: string
  registration: Partial<RegistrationInput>
  lateFee: string
  userFirstName: User['firstName']
  userLastName: User['lastName']
  userEmail: User['email']
}

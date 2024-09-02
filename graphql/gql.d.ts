// This is for vue apollo integration

declare module '*.gql' {
  import { DocumentNode } from 'graphql'

  const value: DocumentNode
  export default value
}

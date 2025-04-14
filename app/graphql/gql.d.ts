// This is for vue apollo integration

declare module '*.gql' {
  import type { DocumentNode } from 'graphql'

  const value: DocumentNode
  export default value
}

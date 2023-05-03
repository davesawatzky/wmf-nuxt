import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, concat } from '@apollo/client/core'
import fetch from 'cross-fetch'

const httpLink = new HttpLink({
  // uri: 'https://wmf-registration-38bfy.ondigitalocean.app/graphql',
  uri: 'http://localhost:3000/graphql',
  fetch: <(input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>>fetch,
})

const authLink = new ApolloLink((operation, forward) => {
  const token = sessionStorage.getItem('diatonicToken')
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null,
    },
  })
  return forward(operation)
})

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
})

export default apolloClient

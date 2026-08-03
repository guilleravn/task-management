import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
  },
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

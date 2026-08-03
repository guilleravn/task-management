import { ApolloProvider } from '@apollo/client/react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { apolloClient } from './lib/apollo-client'
import { ErrorBoundary } from './components/ErrorBoundary'
import { router } from './routes/router'

function App() {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </ApolloProvider>
    </ErrorBoundary>
  )
}

export default App

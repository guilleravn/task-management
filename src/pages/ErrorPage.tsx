import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'

export function ErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong.'

  return (
    <div>
      <h1>Oops</h1>
      <p>{message}</p>
      <Link to="/">Back to dashboard</Link>
    </div>
  )
}

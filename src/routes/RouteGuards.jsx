import { Navigate } from 'react-router-dom'
import { ROUTES, getHomePath } from './routePaths'

export function PublicOnlyRoute({ children, user }) {
  if (user) {
    return <Navigate replace to={getHomePath(user)} />
  }

  return children
}

export function ProtectedRoute({ children, user }) {
  if (!user) {
    return <Navigate replace to={ROUTES.login} />
  }

  return children
}

export function AdminRoute({ children, user }) {
  if (!user) {
    return <Navigate replace to={ROUTES.login} />
  }

  if (user.role !== 'admin') {
    return <Navigate replace to={ROUTES.vote} />
  }

  return children
}

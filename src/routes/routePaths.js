export const ROUTES = {
  root: '/',
  login: '/login',
  signup: '/signup',
  candidates: '/candidates',
  stats: '/stats',
  vote: '/vote',
}

export function getHomePath(user) {
  if (!user) {
    return ROUTES.login
  }

  return user.role === 'admin' ? ROUTES.candidates : ROUTES.vote
}

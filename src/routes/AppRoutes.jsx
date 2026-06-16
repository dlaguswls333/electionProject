import { Navigate, Route, Routes } from 'react-router-dom'
import CandidateRegistrationScreen from '../components/CandidateRegistrationScreen'
import LoginScreen from '../components/LoginScreen'
import SignupScreen from '../components/SignupScreen'
import StatsScreen from '../components/StatsScreen'
import VoteScreen from '../components/VoteScreen'
import { AdminRoute, ProtectedRoute, PublicOnlyRoute } from './RouteGuards'
import { ROUTES, getHomePath } from './routePaths'

function AppRoutes({
  candidateRegistrationProps,
  loginProps,
  signupProps,
  statsProps,
  user,
  voteProps,
}) {
  return (
    <Routes>
      <Route element={<HomeRedirect user={user} />} path={ROUTES.root} />
      <Route
        element={
          <PublicOnlyRoute user={user}>
            <LoginScreen {...loginProps} />
          </PublicOnlyRoute>
        }
        path={ROUTES.login}
      />
      <Route
        element={
          <PublicOnlyRoute user={user}>
            <SignupScreen {...signupProps} />
          </PublicOnlyRoute>
        }
        path={ROUTES.signup}
      />
      <Route
        element={
          <AdminRoute user={user}>
            <CandidateRegistrationScreen {...candidateRegistrationProps} />
          </AdminRoute>
        }
        path={ROUTES.candidates}
      />
      <Route
        element={
          <AdminRoute user={user}>
            <StatsScreen {...statsProps} />
          </AdminRoute>
        }
        path={ROUTES.stats}
      />
      <Route
        element={
          <ProtectedRoute user={user}>
            <VoteScreen {...voteProps} />
          </ProtectedRoute>
        }
        path={ROUTES.vote}
      />
      <Route element={<HomeRedirect user={user} />} path="*" />
    </Routes>
  )
}

function HomeRedirect({ user }) {
  return <Navigate replace to={getHomePath(user)} />
}

export default AppRoutes

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearAuthSession,
  loadAuthSession,
  login,
  saveAuthSession,
  signup,
} from './api/auth'
import TopBar from './components/TopBar'
import { CANDIDATE_COLORS, STORAGE_KEY, TOTAL_VOTERS } from './data/electionData'
import AppRoutes from './routes/AppRoutes'
import { ROUTES, getHomePath } from './routes/routePaths'
import GlobalStyles from './styles/GlobalStyles'
import { AppShell } from './styles/primitives'
import {
  classNameToLabel,
  createCandidateId,
  createElectionCsv,
  loadElectionState,
} from './utils/electionUtils'

function App() {
  const navigate = useNavigate()
  const [electionState, setElectionState] = useState(loadElectionState)
  const [user, setUser] = useState(loadAuthSession)
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    electionState.submittedCandidateId || electionState.candidates[0]?.id || '',
  )
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const { candidates, classStats, hasVoted, submittedCandidateId } = electionState

  const totalVotes = useMemo(
    () => candidates.reduce((sum, candidate) => sum + candidate.votes, 0),
    [candidates],
  )

  const summary = useMemo(() => {
    const missing = Math.max(TOTAL_VOTERS - totalVotes, 0)
    const voteRate = ((totalVotes / TOTAL_VOTERS) * 100).toFixed(1)

    return {
      totalVoters: TOTAL_VOTERS,
      completed: totalVotes,
      missing,
      voteRate,
    }
  }, [totalVotes])

  const currentSelectedCandidateId =
    submittedCandidateId ||
    (candidates.some((candidate) => candidate.id === selectedCandidateId)
      ? selectedCandidateId
      : candidates[0]?.id || '')
  const selectedCandidate = candidates.find(
    (candidate) => candidate.id === currentSelectedCandidateId,
  )

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(electionState))
  }, [electionState])

  async function handleLogin(credentials) {
    const loginUser = await login(credentials)

    saveAuthSession(loginUser, { remember: credentials.remember })
    setUser(loginUser)
    navigate(getHomePath(loginUser), { replace: true })
  }

  function handleLogout() {
    clearAuthSession()
    setUser(null)
    navigate(ROUTES.login, { replace: true })
  }

  function handleAddCandidate(form) {
    const newCandidate = {
      id: createCandidateId(),
      number: Number(form.number),
      name: form.name.trim(),
      className: form.className.trim(),
      pledge: form.pledge.trim(),
      description: form.description.trim(),
      photoUrl: form.photoUrl,
      photoName: form.photoName,
      color: CANDIDATE_COLORS[candidates.length % CANDIDATE_COLORS.length],
      votes: 0,
    }

    setElectionState((current) => ({
      ...current,
      candidates: [...current.candidates, newCandidate].sort(
        (left, right) => left.number - right.number,
      ),
    }))
  }

  function handleUpdateCandidate(candidateId, form) {
    setElectionState((current) => ({
      ...current,
      candidates: current.candidates
        .map((candidate) =>
          candidate.id === candidateId
            ? {
                ...candidate,
                number: Number(form.number),
                name: form.name.trim(),
                className: form.className.trim(),
                pledge: form.pledge.trim(),
                description: form.description.trim(),
                photoUrl: form.photoUrl,
                photoName: form.photoName,
              }
            : candidate,
        )
        .sort((left, right) => left.number - right.number),
    }))
  }

  function handleDeleteCandidate(candidateId) {
    const candidate = candidates.find((item) => item.id === candidateId)

    if (!candidate || !window.confirm(`${candidate.name} 후보를 삭제할까요?`)) {
      return
    }

    const remainingCandidates = candidates.filter((item) => item.id !== candidateId)

    setElectionState((current) => ({
      ...current,
      candidates: current.candidates.filter((item) => item.id !== candidateId),
      hasVoted:
        current.submittedCandidateId === candidateId ? false : current.hasVoted,
      submittedCandidateId:
        current.submittedCandidateId === candidateId ? '' : current.submittedCandidateId,
    }))

    if (selectedCandidateId === candidateId || submittedCandidateId === candidateId) {
      setSelectedCandidateId(remainingCandidates[0]?.id || '')
    }
  }

  function handleSubmitVote() {
    const candidateIdToSubmit = currentSelectedCandidateId

    if (!candidateIdToSubmit || hasVoted) {
      return
    }

    setElectionState((current) => {
      const classLabel = classNameToLabel(user?.className || '2학년 3반')

      return {
        ...current,
        hasVoted: true,
        submittedCandidateId: candidateIdToSubmit,
        candidates: current.candidates.map((candidate) =>
          candidate.id === candidateIdToSubmit
            ? { ...candidate, votes: candidate.votes + 1 }
            : candidate,
        ),
        classStats: current.classStats.map((classItem) =>
          classItem.label === classLabel
            ? {
                ...classItem,
                voted: Math.min(classItem.total, classItem.voted + 1),
              }
            : classItem,
        ),
      }
    })
    setLastRefresh(new Date())
  }

  function handleDownloadCsv() {
    const csv = createElectionCsv({ candidates, classStats, totalVotes })
    const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'daeso-vote-report.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const appRoutesProps = {
    candidateRegistrationProps: {
      candidates,
      onAddCandidate: handleAddCandidate,
      onDeleteCandidate: handleDeleteCandidate,
      onUpdateCandidate: handleUpdateCandidate,
    },
    loginProps: {
      onLogin: handleLogin,
    },
    signupProps: {
      onSignup: signup,
    },
    statsProps: {
      candidates,
      classStats,
      lastRefresh,
      onDownloadCsv: handleDownloadCsv,
      onRefresh: () => setLastRefresh(new Date()),
      summary,
      totalVotes,
    },
    user,
    voteProps: {
      candidates,
      hasVoted,
      onSelectCandidate: setSelectedCandidateId,
      onSubmitVote: handleSubmitVote,
      selectedCandidate,
      selectedCandidateId: currentSelectedCandidateId,
      user,
    },
  }

  return (
    <>
      <GlobalStyles />
      <AppShell>
        <TopBar
          onLogout={handleLogout}
          user={user}
        />

        <AppRoutes {...appRoutesProps} />
      </AppShell>
    </>
  )
}

export default App

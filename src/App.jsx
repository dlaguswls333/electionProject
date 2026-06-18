import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearAuthSession,
  loadAuthSession,
  login,
  saveAuthSession,
  signup,
} from './api/auth'
import {
  getCandidates,
  loadVoteStatus,
  registerCandidate,
  saveVoteStatus,
  submitVote,
} from './api/election'
import TopBar from './components/TopBar'
import { CANDIDATE_COLORS, STORAGE_KEY, TOTAL_VOTERS } from './data/electionData'
import AppRoutes from './routes/AppRoutes'
import { ROUTES, getHomePath } from './routes/routePaths'
import GlobalStyles from './styles/GlobalStyles'
import { AppShell } from './styles/primitives'
import {
  classNameToLabel,
  createElectionCsv,
  loadElectionState,
} from './utils/electionUtils'

function App() {
  const navigate = useNavigate()
  const initialUser = loadAuthSession()
  const [electionState, setElectionState] = useState(() => ({
    ...loadElectionState(),
    ...loadVoteStatus(initialUser),
  }))
  const [user, setUser] = useState(initialUser)
  const [selectedCandidateId, setSelectedCandidateId] = useState('')
  const [candidateLoadError, setCandidateLoadError] = useState('')
  const [voteError, setVoteError] = useState('')
  const [isSubmittingVote, setIsSubmittingVote] = useState(false)
  const [voteCompletion, setVoteCompletion] = useState({
    candidateName: '',
    isOpen: false,
  })
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const { candidates, classStats, hasVoted } = electionState

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

  const currentSelectedCandidateId = candidates.some(
    (candidate) => candidate.id === selectedCandidateId,
  )
    ? selectedCandidateId
    : ''
  const selectedCandidate = candidates.find(
    (candidate) => candidate.id === currentSelectedCandidateId,
  )
  const isServerCandidateSelected = Boolean(selectedCandidate?.isServerCandidate)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(electionState))
  }, [electionState])

  useEffect(() => {
    let isMounted = true

    async function loadCandidatesFromServer() {
      try {
        const serverCandidates = await getCandidates()

        if (!isMounted) {
          return
        }

        setElectionState((current) => {
          const existingCandidates = new Map(
            current.candidates.map((candidate) => [candidate.id, candidate]),
          )

          return {
            ...current,
            candidates: serverCandidates.map((candidate, index) => {
              const existingCandidate = existingCandidates.get(candidate.id)

              return {
                ...candidate,
                className: candidate.className || existingCandidate?.className || '',
                color:
                  existingCandidate?.color ||
                  CANDIDATE_COLORS[index % CANDIDATE_COLORS.length],
                description: candidate.description || existingCandidate?.description || '',
                number: existingCandidate?.number || index + 1,
                photoName: existingCandidate?.photoName || '',
                photoUrl: existingCandidate?.photoUrl || '',
                votes: existingCandidate?.votes ?? 0,
              }
            }),
          }
        })
        setSelectedCandidateId('')
        setCandidateLoadError('')
      } catch (error) {
        if (!isMounted) {
          return
        }

        setCandidateLoadError(
          error instanceof Error
            ? error.message
            : '후보 목록을 불러오지 못했습니다.',
        )
      }
    }

    loadCandidatesFromServer()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleLogin(credentials) {
    const loginUser = await login(credentials)

    saveAuthSession(loginUser, { remember: credentials.remember })
    setElectionState((current) => ({
      ...current,
      ...loadVoteStatus(loginUser),
    }))
    setSelectedCandidateId('')
    setVoteCompletion({ candidateName: '', isOpen: false })
    setUser(loginUser)
    navigate(getHomePath(loginUser), { replace: true })
  }

  function handleLogout() {
    clearAuthSession()
    setElectionState((current) => ({
      ...current,
      hasVoted: false,
      submittedCandidateId: '',
    }))
    setSelectedCandidateId('')
    setVoteCompletion({ candidateName: '', isOpen: false })
    setUser(null)
    navigate(ROUTES.login, { replace: true })
  }

  async function handleAddCandidate(form) {
    const registeredCandidate = await registerCandidate(form)
    const newCandidate = {
      ...registeredCandidate,
      photoUrl: form.photoUrl,
      photoName: form.photoName,
      color: CANDIDATE_COLORS[candidates.length % CANDIDATE_COLORS.length],
      number: candidates.length + 1,
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

    setElectionState((current) => ({
      ...current,
      candidates: current.candidates.filter((item) => item.id !== candidateId),
      hasVoted:
        current.submittedCandidateId === candidateId ? false : current.hasVoted,
      submittedCandidateId:
        current.submittedCandidateId === candidateId ? '' : current.submittedCandidateId,
    }))

    if (selectedCandidateId === candidateId) {
      setSelectedCandidateId('')
    }
  }

  async function handleSubmitVote() {
    const candidateIdToSubmit = currentSelectedCandidateId

    if (!candidateIdToSubmit || hasVoted || isSubmittingVote) {
      return
    }

    if (!selectedCandidate?.isServerCandidate) {
      setVoteError('서버 후보 목록을 불러온 뒤 투표해 주세요.')
      return
    }

    setIsSubmittingVote(true)
    setVoteError('')

    try {
      await submitVote(candidateIdToSubmit)
    } catch (error) {
      setVoteError(
        error instanceof Error ? error.message : '투표 제출에 실패했습니다.',
      )
      setIsSubmittingVote(false)
      return
    }

    const candidateName =
      selectedCandidate?.name ||
      candidates.find((candidate) => candidate.id === candidateIdToSubmit)?.name ||
      ''

    saveVoteStatus(user, {
      hasVoted: true,
      submittedCandidateId: candidateIdToSubmit,
    })

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
    setVoteCompletion({
      candidateName,
      isOpen: true,
    })
    setSelectedCandidateId('')
    setLastRefresh(new Date())
    setIsSubmittingVote(false)
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
      candidateLoadError,
      candidates,
      hasVoted,
      isSubmittingVote,
      voteCompletion,
      onCloseVoteCompletion: () =>
        setVoteCompletion({ candidateName: '', isOpen: false }),
      onSelectCandidate: setSelectedCandidateId,
      onSubmitVote: handleSubmitVote,
      selectedCandidate,
      selectedCandidateId: currentSelectedCandidateId,
      canSubmitVote: isServerCandidateSelected,
      user,
      voteError,
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

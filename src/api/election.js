import { getAuthToken } from './auth'
import { CANDIDATE_COLORS } from '../data/electionData'
import { getApiUrl } from '../config/env'

const VOTE_STATUS_KEY_PREFIX = 'election.vote.status'

// HTTP 상태 코드를 함께 보관해서 409 같은 서버 응답을 화면 로직에서 구분한다.
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function getCandidates() {
  const payload = await requestJson('/api/candidates')

  return Array.isArray(payload) ? payload.map(normalizeCandidate) : []
}

export async function registerCandidate(form) {
  const payload = await requestJson('/api/candidates', {
    body: JSON.stringify({
      district: form.className.trim(),
      introduction: form.description.trim(),
      name: form.name.trim(),
      pledge: form.pledge.trim(),
    }),
    method: 'POST',
  })

  return normalizeCandidate(payload)
}

export async function submitVote(candidateId) {
  // Swagger 명세상 candidateId는 숫자이므로 문자열 ID가 들어오면 숫자로 변환한다.
  const numericCandidateId = Number(candidateId)

  if (!Number.isFinite(numericCandidateId)) {
    throw new Error('서버 후보 목록을 불러온 뒤 투표해 주세요.')
  }

  return requestJson('/api/votes', {
    body: JSON.stringify({
      candidateId: numericCandidateId,
    }),
    method: 'POST',
  })
}

export function loadVoteStatus(user) {
  // 로그인 사용자가 없으면 저장된 투표 완료 상태도 없다고 본다.
  if (!user) {
    return { hasVoted: false, submittedCandidateId: '' }
  }

  const storageKey = getVoteStatusStorageKey(user)
  const raw = window.localStorage.getItem(storageKey)

  if (!raw) {
    return { hasVoted: false, submittedCandidateId: '' }
  }

  try {
    const parsed = JSON.parse(raw)

    return {
      hasVoted: Boolean(parsed.hasVoted),
      submittedCandidateId: parsed.submittedCandidateId || '',
    }
  } catch {
    window.localStorage.removeItem(storageKey)
    return { hasVoted: false, submittedCandidateId: '' }
  }
}

export function saveVoteStatus(user, status) {
  // 사용자별 저장 키를 분리해서 다른 계정의 투표 완료 상태와 섞이지 않게 한다.
  if (!user) {
    return
  }

  window.localStorage.setItem(
    getVoteStatusStorageKey(user),
    JSON.stringify({
      hasVoted: Boolean(status.hasVoted),
      submittedCandidateId: status.submittedCandidateId || '',
    }),
  )
}

export function clearVoteStatus(user) {
  if (!user) {
    return
  }

  window.localStorage.removeItem(getVoteStatusStorageKey(user))
}

async function requestJson(path, options = {}) {
  let response

  try {
    response = await fetch(getApiUrl(path), {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
  } catch {
    throw new Error('서버에 연결할 수 없습니다. API 주소를 확인해 주세요.')
  }

  const payload = await readJson(response)

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload) || `요청에 실패했습니다. (${response.status})`,
      response.status,
    )
  }

  return payload
}

async function readJson(response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function getAuthHeader() {
  const token = getAuthToken()

  return token ? { Authorization: `Bearer ${token}` } : {}
}

function getVoteStatusStorageKey(user) {
  const account = user.id || user.account || user.username || user.name || 'anonymous'

  return `${VOTE_STATUS_KEY_PREFIX}.${account}`
}

function getErrorMessage(payload) {
  if (!payload || typeof payload !== 'object') {
    return typeof payload === 'string' ? payload : ''
  }

  return payload.message || payload.error || payload.reason || ''
}

function normalizeCandidate(candidate, index = 0) {
  // 서버 후보 응답을 화면 컴포넌트가 사용하는 후보 데이터 구조로 변환한다.
  return {
    className: candidate.district || '',
    color: CANDIDATE_COLORS[index % CANDIDATE_COLORS.length],
    createdAt: candidate.createdAt || '',
    description: candidate.introduction || '',
    id: candidate.id,
    isServerCandidate: true,
    name: candidate.name || '',
    number: index + 1,
    photoName: '',
    photoUrl: '',
    pledge: candidate.pledge || '',
    votes: 0,
  }
}

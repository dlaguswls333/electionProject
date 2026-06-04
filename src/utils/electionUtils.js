import {
  DEFAULT_CANDIDATES,
  DEFAULT_CLASS_STATS,
  STORAGE_KEY,
  makeInitialElectionState,
} from '../data/electionData'

export function loadElectionState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return makeInitialElectionState()
    }

    const parsed = JSON.parse(raw)

    return {
      ...makeInitialElectionState(),
      ...parsed,
      candidates: Array.isArray(parsed.candidates)
        ? parsed.candidates
        : DEFAULT_CANDIDATES,
      classStats: Array.isArray(parsed.classStats)
        ? parsed.classStats
        : DEFAULT_CLASS_STATS,
    }
  } catch {
    return makeInitialElectionState()
  }
}

export function createEmptyForm(candidates) {
  const nextNumber =
    candidates.reduce((highest, candidate) => Math.max(highest, candidate.number), 0) + 1

  return {
    number: String(nextNumber),
    name: '',
    className: '',
    pledge: '',
    description: '',
    photoUrl: '',
    photoName: '',
  }
}

export function getPercent(voted, total) {
  if (!total) {
    return 0
  }

  return Math.min(100, Math.round((voted / total) * 100))
}

export function classNameToLabel(className) {
  const match = className.match(/(\d)\D+(\d)/)

  if (!match) {
    return ''
  }

  return `${match[1]}-${match[2]}`
}

export function getCandidateShare(candidateVotes, totalVotes) {
  if (!totalVotes) {
    return '0.0'
  }

  return ((candidateVotes / totalVotes) * 100).toFixed(1)
}

export function formatTime(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

export function createCandidateId() {
  return globalThis.crypto?.randomUUID?.() || String(Date.now())
}

export function createElectionCsv({ candidates, classStats, totalVotes }) {
  const rows = [
    ['구분', '기호', '후보자', '학년/반', '공약', '득표', '득표율'],
    ...candidates.map((candidate) => [
      '후보별 득표',
      candidate.number,
      candidate.name,
      candidate.className,
      candidate.pledge,
      candidate.votes,
      `${getCandidateShare(candidate.votes, totalVotes)}%`,
    ]),
    [],
    ['구분', '반', '완료', '전체', '투표율'],
    ...classStats.map((classItem) => [
      '반별 투표율',
      classItem.label,
      classItem.voted,
      classItem.total,
      `${getPercent(classItem.voted, classItem.total)}%`,
    ]),
  ]

  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`)
        .join(','),
    )
    .join('\n')
}

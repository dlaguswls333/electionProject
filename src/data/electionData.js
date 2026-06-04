export const STORAGE_KEY = 'daeso-vote-election-state'

export const CANDIDATE_COLORS = [
  '#2563eb',
  '#f59e0b',
  '#0f766e',
  '#db2777',
  '#7c3aed',
]

export const TOTAL_VOTERS = 841

export const DEFAULT_CANDIDATES = [
  {
    id: 'kim-doyoon',
    number: 1,
    name: '김도윤',
    className: '2학년 3반',
    pledge: '자습실 예약제 도입',
    description:
      '빈 강의실과 자습실을 온라인으로 예약하고 사용 현황을 확인할 수 있게 합니다.',
    color: '#2563eb',
    votes: 214,
    photoUrl: '',
    photoName: '',
  },
  {
    id: 'park-seoyeon',
    number: 2,
    name: '박서연',
    className: '2학년 1반',
    pledge: '급식 피드백 공개',
    description: '급식 만족도와 개선 요청을 수집하고 반영 결과를 공개합니다.',
    color: '#f59e0b',
    votes: 181,
    photoUrl: '',
    photoName: '',
  },
  {
    id: 'lee-hajun',
    number: 3,
    name: '이하준',
    className: '2학년 5반',
    pledge: '축제 예산 공개',
    description: '행사 예산과 집행 내용을 학생들이 볼 수 있게 공개합니다.',
    color: '#0f766e',
    votes: 117,
    photoUrl: '',
    photoName: '',
  },
]

export const DEFAULT_CLASS_STATS = [
  { label: '1-1', voted: 92, total: 100 },
  { label: '1-2', voted: 88, total: 100 },
  { label: '1-3', voted: 76, total: 100 },
  { label: '1-4', voted: 72, total: 100 },
  { label: '1-5', voted: 81, total: 100 },
  { label: '2-1', voted: 68, total: 100 },
  { label: '2-2', voted: 74, total: 100 },
  { label: '2-3', voted: 90, total: 100 },
  { label: '2-4', voted: 85, total: 100 },
  { label: '2-5', voted: 61, total: 100 },
  { label: '3-1', voted: 79, total: 100 },
  { label: '3-2', voted: 83, total: 100 },
  { label: '3-3', voted: 69, total: 100 },
  { label: '3-4', voted: 77, total: 100 },
  { label: '3-5', voted: 94, total: 100 },
]

export function makeInitialElectionState() {
  return {
    candidates: DEFAULT_CANDIDATES,
    classStats: DEFAULT_CLASS_STATS,
    hasVoted: false,
    submittedCandidateId: '',
  }
}

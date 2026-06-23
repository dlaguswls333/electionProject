import styled from 'styled-components'
import {
  LightPanel,
  PageContent,
  Pill,
  PrimaryButton,
  SectionHeading,
} from '../styles/primitives'
import VoteCandidateCard from './VoteCandidateCard'

function VoteScreen({
  candidateLoadError,
  canSubmitVote,
  candidates,
  hasVoted,
  isSubmittingVote,
  onSelectCandidate,
  onCloseVoteCompletion,
  onSubmitVote,
  selectedCandidate,
  selectedCandidateId,
  user,
  voteCompletion,
  voteError,
}) {
  const voterName =
    user.role === 'student'
      ? `${user.name}`
      : `${user.name} 관리자`

  return (
    <PageContent>
      <SectionHeading>
        <h1>투표</h1>
        <p>학생이 후보를 선택하고 제출하는 웹 화면입니다.</p>
      </SectionHeading>

      <VoterStatus>
        <Pill
          $background={hasVoted ? '#e6f7f3' : '#dcfce7'}
          $color={hasVoted ? '#0f766e' : '#166534'}
        >
          {hasVoted ? '투표 완료' : '투표 가능'}
        </Pill>
        <div>
          <strong>{voterName}</strong>
          <p>
            {hasVoted
              ? '이미 제출된 투표는 변경할 수 없습니다.'
              : '한 명의 후보만 선택할 수 있으며, 제출 후에는 변경할 수 없습니다.'}
          </p>
        </div>
      </VoterStatus>

      <VoteCardGrid>
        {candidates.map((candidate) => (
          <VoteCandidateCard
            candidate={candidate}
            disabled={hasVoted}
            isSelected={selectedCandidateId === candidate.id}
            key={candidate.id}
            onSelectCandidate={onSelectCandidate}
          />
        ))}
      </VoteCardGrid>

      {candidateLoadError && <StatusMessage>{candidateLoadError}</StatusMessage>}
      {voteError && <StatusMessage>{voteError}</StatusMessage>}

      <SubmitBar>
        <strong>
          선택 후보:{' '}
          {selectedCandidate
            ? `기호 ${selectedCandidate.number} ${selectedCandidate.name}`
            : '없음'}
        </strong>
        <span>
          {hasVoted
            ? '투표 제출이 완료되었습니다.'
            : isSubmittingVote
              ? '투표를 제출하는 중입니다.'
              : selectedCandidate && !canSubmitVote
                ? '서버 후보 목록을 불러온 뒤 제출할 수 있습니다.'
              : '제출 전 선택한 후보를 확인하세요.'}
        </span>
        {/* 후보 미선택, 서버 후보 아님, 이미 투표함, 제출 중인 경우 버튼을 비활성화한다. */}
        <PrimaryButton
          disabled={!selectedCandidate || !canSubmitVote || hasVoted || isSubmittingVote}
          onClick={onSubmitVote}
        >
          {isSubmittingVote ? '제출 중' : '투표 제출'}
        </PrimaryButton>
      </SubmitBar>

      {/* 투표가 정상 처리되면 완료 모달을 보여주고 새로고침 후 재투표 불가를 안내한다. */}
      {voteCompletion.isOpen && (
        <ModalBackdrop onClick={onCloseVoteCompletion}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <h2>투표가 완료되었습니다</h2>
            <p>
              {voteCompletion.candidateName
                ? `${voteCompletion.candidateName} 후보에게 투표했습니다.`
                : '선택한 후보에게 투표했습니다.'}
            </p>
            <small>새로고침해도 다시 투표할 수 없습니다.</small>
            <PrimaryButton onClick={onCloseVoteCompletion}>확인</PrimaryButton>
          </ModalCard>
        </ModalBackdrop>
      )}
    </PageContent>
  )
}

const VoterStatus = styled(LightPanel)`
  display: flex;
  align-items: center;
  gap: clamp(24px, 3vw, 36px);
  min-height: clamp(62px, 8vh, 90px);
  margin-top: clamp(12px, 2.6vh, 48px);
  padding: clamp(14px, 2vh, 20px) 32px;

  strong {
    font-size: 16px;
    line-height: 23px;
  }

  p {
    margin: 3px 0 0;
    color: #64748b;
    font-size: 13px;
    line-height: 18px;
  }

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

const VoteCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: clamp(24px, 3vw, 40px);
  margin-top: clamp(16px, 3vh, 56px);

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const SubmitBar = styled(LightPanel).attrs({ as: 'footer' })`
  display: grid;
  grid-template-columns: 260px 1fr auto;
  gap: 26px;
  align-items: center;
  min-height: clamp(56px, 7vh, 76px);
  margin-top: clamp(14px, 2.8vh, 52px);
  padding: clamp(10px, 1.8vh, 16px) 32px;

  strong {
    font-size: 16px;
    line-height: 23px;
  }

  span {
    color: #64748b;
    font-size: 13px;
    line-height: 18px;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const StatusMessage = styled.p`
  margin: 16px 0 -8px;
  padding: 13px 18px;
  color: #991b1b;
  font-size: 13px;
  font-weight: 700;
  line-height: 19px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
`

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.45);
  z-index: 60;
`

const ModalCard = styled.div`
  display: grid;
  gap: 14px;
  width: min(420px, 100%);
  padding: 28px 26px 24px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);

  h2 {
    margin: 0;
    color: #0f172a;
    font-size: 20px;
    line-height: 28px;
  }

  p {
    margin: 0;
    color: #334155;
    font-size: 14px;
    line-height: 22px;
  }

  small {
    color: #64748b;
    font-size: 12px;
    line-height: 18px;
  }

  button {
    justify-self: end;
  }
`

export default VoteScreen

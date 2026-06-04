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
  candidates,
  hasVoted,
  onSelectCandidate,
  onSubmitVote,
  selectedCandidate,
  selectedCandidateId,
  user,
}) {
  const voterName =
    user.role === 'student'
      ? `${user.className} ${user.number ? `${user.number}번 ` : ''}${user.name}`
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

      <SubmitBar>
        <strong>
          선택 후보:{' '}
          {selectedCandidate
            ? `기호 ${selectedCandidate.number} ${selectedCandidate.name}`
            : '없음'}
        </strong>
        <span>
          {hasVoted ? '투표 제출이 완료되었습니다.' : '제출 전 선택한 후보를 확인하세요.'}
        </span>
        <PrimaryButton
          disabled={!selectedCandidate || hasVoted}
          onClick={onSubmitVote}
        >
          투표 제출
        </PrimaryButton>
      </SubmitBar>
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

export default VoteScreen

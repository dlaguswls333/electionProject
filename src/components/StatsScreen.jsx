import styled from 'styled-components'
import {
  PageContent,
  Panel,
  PanelTitleRow,
  PrimaryButton,
  SecondaryButton,
  SectionHeading,
} from '../styles/primitives'
import { formatTime, getPercent } from '../utils/electionUtils'
import CandidateVoteRow from './CandidateVoteRow'
import ClassRateItem from './ClassRateItem'

function StatsScreen({
  candidates,
  classStats,
  lastRefresh,
  onDownloadCsv,
  onRefresh,
  summary,
  totalVotes,
}) {
  const statCards = [
    {
      label: '전체 유권자',
      value: `${summary.totalVoters}명`,
      caption: '등록된 선거인 수',
      color: '#2563eb',
      tint: '#dbeafe',
    },
    {
      label: '투표 완료',
      value: `${summary.completed}명`,
      caption: '현재까지 제출',
      color: '#0f766e',
      tint: '#ccfbf1',
    },
    {
      label: '투표율',
      value: `${summary.voteRate}%`,
      caption: '완료 / 전체',
      color: '#f59e0b',
      tint: '#fef3c7',
    },
    {
      label: '미투표',
      value: `${summary.missing}명`,
      caption: '아직 제출 안 함',
      color: '#db2777',
      tint: '#fce7f3',
    },
  ]

  return (
    <PageContent>
      <StatsHeading>
        <div>
          <h1>투표 현황 집계</h1>
          <p>전체 투표 수, 투표율, 반별 현황, 후보별 득표를 한 화면에서 집계합니다.</p>
        </div>
        <span>마지막 갱신 {formatTime(lastRefresh)}</span>
      </StatsHeading>

      <StatGrid>
        {statCards.map((card) => (
          <StatCard key={card.label}>
            <StatAccent $color={card.color} />
            <StatIcon $background={card.tint} />
            <p>{card.label}</p>
            <strong>{card.value}</strong>
            <small>{card.caption}</small>
          </StatCard>
        ))}
      </StatGrid>

      <AggregationLayout>
        <ClassPanel>
          <PanelTitleRow $vertical>
            <h2>반별 투표율</h2>
            <p>학년·반별 투표 완료 비율</p>
          </PanelTitleRow>
          <ClassGrid>
            {classStats.map((classItem) => (
              <ClassRateItem
                classItem={classItem}
                key={classItem.label}
                percent={getPercent(classItem.voted, classItem.total)}
              />
            ))}
          </ClassGrid>
        </ClassPanel>

        <VotePanel>
          <h2>후보별 득표</h2>
          <VoteStack>
            {candidates.map((candidate) => (
              <CandidateVoteRow
                candidate={candidate}
                key={candidate.id}
                totalVotes={totalVotes}
              />
            ))}
          </VoteStack>
        </VotePanel>
      </AggregationLayout>

      <StatsActions>
        <PrimaryButton onClick={onRefresh}>집계 새로고침</PrimaryButton>
        <SecondaryButton onClick={onDownloadCsv}>목록 다운로드</SecondaryButton>
      </StatsActions>
    </PageContent>
  )
}

const StatsHeading = styled(SectionHeading)`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 32px;

  > span {
    color: #64748b;
    font-size: 13px;
    font-weight: 700;
  }

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(24px, 3vw, 40px);
  margin: clamp(12px, 2vh, 36px) 0 clamp(14px, 2.4vh, 44px);

  @media (max-width: 1180px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.article`
  position: relative;
  min-height: clamp(92px, 12vh, 132px);
  overflow: hidden;
  padding: clamp(18px, 2.5vh, 26px) 24px 14px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 14px 15px rgba(15, 23, 42, 0.08);

  p {
    margin: 0;
    color: #64748b;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
  }

  strong {
    display: block;
    margin-top: 2px;
    color: #0f172a;
    font-size: clamp(26px, 2.6vw, 30px);
    font-weight: 800;
    line-height: 34px;
  }

  small {
    display: block;
    margin-top: 2px;
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
    line-height: 17px;
  }
`

const StatAccent = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 4px;
  background: ${({ $color }) => $color};
`

const StatIcon = styled.span`
  position: absolute;
  top: 26px;
  right: 28px;
  width: 34px;
  height: 34px;
  background: ${({ $background }) => $background};
  border-radius: 8px;
`

const AggregationLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 820px) minmax(280px, 360px);
  gap: clamp(24px, 3vw, 40px);

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`

const ClassPanel = styled(Panel)`
  min-height: clamp(260px, 36vh, 456px);
`

const VotePanel = styled(Panel)`
  min-height: clamp(260px, 36vh, 456px);
  overflow: hidden;

  h2 {
    margin: 0;
    color: #0f172a;
    font-size: 20px;
    font-weight: 800;
    line-height: 28px;
  }
`

const ClassGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(20px, 3vh, 48px) 22px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const VoteStack = styled.div`
  display: grid;
  gap: clamp(20px, 3.2vh, 58px);
  max-height: clamp(170px, 25vh, 350px);
  margin-top: clamp(18px, 3vh, 48px);
  overflow: auto;
  padding-right: 2px;
`

const StatsActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: clamp(8px, 1.6vh, 26px);

  @media (max-width: 760px) {
    justify-content: stretch;

    button {
      flex: 1;
    }
  }
`

export default StatsScreen

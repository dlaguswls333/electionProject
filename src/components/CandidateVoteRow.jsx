import styled from 'styled-components'
import { ProgressTrack } from '../styles/primitives'
import { getCandidateShare } from '../utils/electionUtils'

function CandidateVoteRow({ candidate, totalVotes }) {
  const share = getCandidateShare(candidate.votes, totalVotes)

  return (
    <Row>
      <Header>
        <strong>{candidate.name}</strong>
        <span>{candidate.votes}표</span>
        <em style={{ color: candidate.color }}>{share}%</em>
      </Header>
      <ProgressTrack $color={candidate.color} $height="11px" $percent={share}>
        <span />
      </ProgressTrack>
    </Row>
  )
}

const Row = styled.article``

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 70px 56px;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;

  strong {
    font-size: 16px;
    line-height: 22px;
  }

  span {
    color: #334155;
    font-size: 14px;
    font-weight: 800;
  }

  em {
    font-size: 13px;
    font-style: normal;
    font-weight: 800;
    text-align: right;
  }
`

export default CandidateVoteRow

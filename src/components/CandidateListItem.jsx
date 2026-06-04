import styled from 'styled-components'
import { SecondaryButton } from '../styles/primitives'

function CandidateListItem({ candidate, onDeleteCandidate, onEditCandidate }) {
  return (
    <Item>
      <NumberBadge $color={candidate.color}>{candidate.number}</NumberBadge>
      <div>
        <strong>{candidate.name}</strong>
        <p>
          {candidate.className} · {candidate.pledge}
        </p>
      </div>
      <ItemActions>
        <SecondaryButton $compact onClick={() => onEditCandidate(candidate)}>
          수정
        </SecondaryButton>
        <SecondaryButton $compact onClick={() => onDeleteCandidate(candidate.id)}>
          삭제
        </SecondaryButton>
      </ItemActions>
    </Item>
  )
}

const Item = styled.article`
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 24px;
  align-items: center;
  min-height: 112px;
  padding: 20px 24px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  strong {
    display: block;
    font-size: 17px;
    line-height: 24px;
  }

  p {
    margin: 4px 0 0;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
  }

  @media (max-width: 760px) {
    grid-template-columns: 48px 1fr;
  }
`

const NumberBadge = styled.span`
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  color: #ffffff;
  font-size: 18px;
  font-weight: 800;
  background: ${({ $color }) => $color};
  border-radius: 50%;
`

const ItemActions = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 760px) {
    grid-column: 1 / -1;
  }
`

export default CandidateListItem

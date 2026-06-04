import styled from 'styled-components'

function VoteCandidateCard({ candidate, disabled, isSelected, onSelectCandidate }) {
  return (
    <Card
      $selected={isSelected}
      disabled={disabled}
      onClick={() => onSelectCandidate(candidate.id)}
      type="button"
    >
      <NumberHeader $color={candidate.color}>{candidate.number}</NumberHeader>
      <RadioMark $checked={isSelected} />
      <strong>{candidate.name}</strong>
      <em>{candidate.pledge}</em>
      <p>{candidate.description}</p>
    </Card>
  )
}

const Card = styled.button`
  position: relative;
  display: block;
  min-height: 358px;
  padding: 28px;
  color: #0f172a;
  text-align: left;
  background: ${({ $selected }) => ($selected ? '#ecfdf5' : '#ffffff')};
  border: 1px solid ${({ $selected }) => ($selected ? '#0f766e' : '#e5e7eb')};
  border-radius: 8px;
  box-shadow: 0 14px 15px rgba(15, 23, 42, 0.08);
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  > strong {
    display: block;
    margin-top: 36px;
    font-size: 22px;
    line-height: 30px;
  }

  > em {
    display: block;
    margin-top: 12px;
    color: #475569;
    font-size: 14px;
    font-style: normal;
    font-weight: 800;
    line-height: 20px;
  }

  > p {
    margin: 34px 0 0;
    color: #64748b;
    font-size: 13px;
    line-height: 19px;
  }
`

const NumberHeader = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  height: 112px;
  padding-left: 24px;
  color: #ffffff;
  font-size: 40px;
  font-weight: 800;
  line-height: 50px;
  background: ${({ $color }) => $color};
  border-radius: 8px;
`

const RadioMark = styled.span`
  position: absolute;
  top: 174px;
  right: 40px;
  width: 26px;
  height: 26px;
  background: #ffffff;
  border: 2px solid ${({ $checked }) => ($checked ? '#0f766e' : '#cbd5e1')};
  border-radius: 50%;

  &::after {
    position: absolute;
    top: 6px;
    left: 6px;
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    width: 10px;
    height: 10px;
    background: #0f766e;
    border-radius: 50%;
    content: '';
  }
`

export default VoteCandidateCard

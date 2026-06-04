import styled from 'styled-components'
import { ProgressTrack } from '../styles/primitives'

function ClassRateItem({ classItem, percent }) {
  const color =
    percent >= 85
      ? '#0f766e'
      : percent >= 75
        ? '#2563eb'
        : percent >= 65
          ? '#f59e0b'
          : '#ef4444'

  return (
    <Item>
      <Header>
        <strong>{classItem.label}</strong>
        <span style={{ color }}>{percent}%</span>
      </Header>
      <ProgressTrack $color={color} $percent={percent}>
        <span />
      </ProgressTrack>
    </Item>
  )
}

const Item = styled.article`
  min-width: 0;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 800;

  strong {
    color: #334155;
  }

  span {
    white-space: nowrap;
  }
`

export default ClassRateItem

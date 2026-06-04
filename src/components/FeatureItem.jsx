import styled from 'styled-components'

function FeatureItem({ description, title }) {
  return (
    <Item>
      <Dot aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </Item>
  )
}

const Item = styled.div`
  display: grid;
  grid-template-columns: 14px 1fr;
  gap: 18px;
  align-items: start;

  strong {
    display: block;
    font-size: 15px;
    line-height: 22px;
  }

  p {
    margin: 4px 0 0;
    color: #ccfbf1;
    font-size: 12px;
    line-height: 18px;
  }
`

const Dot = styled.span`
  width: 14px;
  height: 14px;
  margin-top: 5px;
  background: #99f6e4;
  border-radius: 50%;
`

export default FeatureItem

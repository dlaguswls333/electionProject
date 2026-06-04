import styled from 'styled-components'

export const AppShell = styled.main`
  width: min(1440px, 100%);
  min-height: 960px;
  margin: 0 auto;
  overflow: hidden;
  background: #f7f8fb;
  box-shadow: 0 14px 30px -16px rgba(15, 23, 42, 0.08);

  @media (max-width: 1180px) {
    min-height: 100vh;
  }
`

export const PageContent = styled.section`
  padding: 48px 80px 72px;

  @media (max-width: 1180px) {
    padding: 40px 24px 64px;
  }
`

export const SectionHeading = styled.div`
  margin-bottom: ${({ $compact }) => ($compact ? '6px' : '28px')};

  h1,
  h2 {
    margin: 0;
    color: #0f172a;
    font-weight: 800;
    letter-spacing: 0;
  }

  h1 {
    font-size: 30px;
    line-height: 40px;
  }

  h2 {
    font-size: 28px;
    line-height: 38px;
  }

  p {
    margin: 6px 0 0;
    color: #64748b;
    font-size: 15px;
    line-height: 22px;
  }
`

export const Panel = styled.section`
  padding: 28px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 14px 15px rgba(15, 23, 42, 0.08);
`

export const LightPanel = styled.article`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 14px 15px rgba(15, 23, 42, 0.08);
`

export const PanelTitleRow = styled.div`
  display: ${({ $vertical }) => ($vertical ? 'block' : 'flex')};
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: ${({ $vertical }) => ($vertical ? '38px' : '32px')};

  h2 {
    margin: 0;
    color: #0f172a;
    font-size: 20px;
    font-weight: 800;
    line-height: 28px;
  }

  p {
    margin: 2px 0 0;
    color: #64748b;
    font-size: 13px;
  }
`

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 14px;
  color: ${({ $color }) => $color || '#0f766e'};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  background: ${({ $background }) => $background || '#e6f7f3'};
  border-radius: 999px;
`

export const GhostLink = styled.button`
  padding: 0;
  color: #0f766e;
  font-size: 13px;
  font-weight: 700;
  background: transparent;
  cursor: pointer;
`

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  width: ${({ $full }) => ($full ? '100%' : 'auto')};
  padding: 0 18px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
  background: #0f766e;
  border-radius: 8px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #0b625c;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ $compact }) => ($compact ? '62px' : 'auto')};
  min-height: 42px;
  padding: 0 ${({ $compact }) => ($compact ? '16px' : '18px')};
  color: #334155;
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    border-color: #94a3b8;
  }
`

export const Field = styled.label`
  display: grid;
  gap: 6px;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
  line-height: 18px;

  input,
  textarea {
    width: 100%;
    min-height: 46px;
    padding: 12px 14px;
    color: #0f172a;
    font-size: 14px;
    font-weight: 500;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    outline: none;
  }

  input:focus,
  textarea:focus {
    border-color: #0f766e;
    box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  small {
    margin-top: -32px;
    padding-left: 14px;
    color: #94a3b8;
    font-size: 12px;
    font-weight: 400;
    pointer-events: none;
  }
`

export const ProgressTrack = styled.div`
  width: 100%;
  height: ${({ $height }) => $height || '10px'};
  overflow: hidden;
  background: #e5e7eb;
  border-radius: 999px;

  span {
    display: block;
    width: ${({ $percent }) => `${$percent}%`};
    height: 100%;
    background: ${({ $color }) => $color};
    border-radius: inherit;
  }
`

import { useState } from 'react'
import styled from 'styled-components'
import { Field, GhostLink, PrimaryButton, SectionHeading } from '../styles/primitives'
import FeatureItem from './FeatureItem'

function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('admin')
  const [account, setAccount] = useState('admin@daeso.hs.kr')
  const [password, setPassword] = useState('12345678')
  const [remember, setRemember] = useState(false)
  const [message, setMessage] = useState(
    '학생 투표는 학생 계정 선택 후 학번/PIN으로 접속합니다.',
  )

  function handleRoleChange(nextRole) {
    setRole(nextRole)
    setAccount(nextRole === 'admin' ? 'admin@daeso.hs.kr' : '20314')
    setPassword(nextRole === 'admin' ? '12345678' : '1234')
    setMessage(
      nextRole === 'admin'
        ? '관리자는 후보 등록과 집계 화면에 접근할 수 있습니다.'
        : '학생 투표는 학생 계정 선택 후 학번/PIN으로 접속합니다.',
    )
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!account.trim() || !password.trim()) {
      setMessage('아이디와 비밀번호를 모두 입력해 주세요.')
      return
    }

    onLogin({
      role,
      account: account.trim(),
      name: role === 'admin' ? '선거관리자' : '홍길동',
      className: '2학년 3반',
      number: '14',
      remember,
    })
  }

  return (
    <Layout>
      <HeroPanel>
        <h1>대소고 교내 스마트 선거</h1>
        <p>
          후보자 등록, 투표 현황 집계, 투표를 한 곳에서 처리하는 웹
          시스템입니다.
        </p>

        <FeatureStrip>
          <FeatureItem
            description="관리자는 후보 정보와 공약을 등록합니다."
            title="후보자 등록"
          />
          <FeatureItem
            description="투표율과 후보별 득표를 확인합니다."
            title="투표 현황 집계"
          />
          <FeatureItem
            description="학생은 후보를 선택하고 제출합니다."
            title="투표"
          />
        </FeatureStrip>

        <HeroFooter>
          <strong>웹 전용 화면</strong>
          <span>모바일 화면은 이 프레임에 포함하지 않았습니다.</span>
        </HeroFooter>
      </HeroPanel>

      <LoginCard onSubmit={handleSubmit}>
        <SectionHeading $compact>
          <h2>로그인</h2>
          <p>계정 정보를 입력해 시스템에 접속합니다.</p>
        </SectionHeading>

        <RoleTabs role="tablist" aria-label="로그인 역할">
          <button
            aria-selected={role === 'admin'}
            onClick={() => handleRoleChange('admin')}
            role="tab"
            type="button"
          >
            관리자
          </button>
          <button
            aria-selected={role === 'student'}
            onClick={() => handleRoleChange('student')}
            role="tab"
            type="button"
          >
            학생
          </button>
        </RoleTabs>

        <Field>
          <span>{role === 'admin' ? '아이디' : '학번'}</span>
          <input
            autoComplete="username"
            onChange={(event) => setAccount(event.target.value)}
            value={account}
          />
        </Field>

        <Field>
          <span>{role === 'admin' ? '비밀번호' : 'PIN'}</span>
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </Field>

        <LoginOptions>
          <CheckboxRow>
            <input
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              type="checkbox"
            />
            <span>로그인 상태 유지</span>
          </CheckboxRow>
          <GhostLink
            onClick={() => setMessage('비밀번호 재설정은 선거관리자에게 문의하세요.')}
            type="button"
          >
            비밀번호 찾기
          </GhostLink>
        </LoginOptions>

        <PrimaryButton $full type="submit">
          로그인
        </PrimaryButton>

        <NoticeBox>{message}</NoticeBox>
      </LoginCard>
    </Layout>
  )
}

const Layout = styled.section`
  display: grid;
  grid-template-columns: 580px 520px;
  gap: 120px;
  align-items: center;
  min-height: 878px;
  padding: 50px 80px 80px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 24px 64px;
  }

  @media (max-width: 760px) {
    display: block;
  }
`

const HeroPanel = styled.article`
  min-height: 748px;
  padding: 58px 48px;
  color: #ffffff;
  background: #0f766e;
  border-radius: 8px;
  box-shadow: 0 14px 15px rgba(15, 23, 42, 0.08);

  h1 {
    max-width: 420px;
    margin: 0;
    font-size: 34px;
    font-weight: 800;
    line-height: 44px;
    letter-spacing: 0;
  }

  > p {
    max-width: 410px;
    margin: 52px 0 0;
    color: #ccfbf1;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }

  @media (max-width: 1180px) {
    width: min(100%, 620px);
    margin: 0 auto;
  }

  @media (max-width: 760px) {
    min-height: auto;
    padding: 36px 24px;
  }
`

const FeatureStrip = styled.div`
  display: grid;
  gap: 28px;
  width: 458px;
  margin-top: 66px;
  padding: 40px 24px;
  background: #0b625c;
  border-radius: 8px;

  @media (max-width: 760px) {
    width: 100%;
    margin-top: 36px;
  }
`

const HeroFooter = styled.div`
  margin-top: 92px;

  strong {
    display: block;
    font-size: 16px;
    line-height: 23px;
  }

  span {
    display: block;
    margin-top: 7px;
    color: #ccfbf1;
    font-size: 13px;
    line-height: 18px;
  }

  @media (max-width: 760px) {
    margin-top: 36px;
  }
`

const LoginCard = styled.form`
  display: grid;
  gap: 24px;
  padding: 40px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 14px 15px rgba(15, 23, 42, 0.08);

  @media (max-width: 1180px) {
    width: min(100%, 620px);
    margin: 0 auto;
  }

  @media (max-width: 760px) {
    margin-top: 24px;
    padding: 24px;
  }
`

const RoleTabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  height: 46px;
  padding: 6px;
  background: #e2e8f0;
  border-radius: 8px;

  button {
    color: #64748b;
    font-size: 13px;
    font-weight: 700;
    background: transparent;
    border-radius: 7px;
    cursor: pointer;
  }

  button[aria-selected='true'] {
    color: #0f766e;
    background: #ffffff;
  }
`

const LoginOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
`

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #475569;
  font-size: 13px;
  font-weight: 500;

  input {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: #0f766e;
  }
`

const NoticeBox = styled.p`
  min-height: 44px;
  margin: -10px 0 0;
  padding: 13px 18px;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  line-height: 17px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`

export default LoginScreen

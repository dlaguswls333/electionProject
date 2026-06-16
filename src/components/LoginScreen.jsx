import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ROUTES } from '../routes/routePaths'
import { Field, GhostLink, PrimaryButton, SectionHeading } from '../styles/primitives'
import FeatureItem from './FeatureItem'

function LoginScreen({ onLogin }) {
  const navigate = useNavigate()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(
    '학생 계정으로 로그인합니다.',
  )

  async function handleSubmit(event) {
    event.preventDefault()

    if (!account.trim() || !password.trim()) {
      setMessage('아이디와 비밀번호를 모두 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    setMessage('로그인 요청을 보내는 중입니다.')

    try {
      await onLogin({
        password,
        remember,
        username: account.trim(),
      })
    } catch (error) {
      setIsSubmitting(false)
      setMessage(
        error instanceof Error ? error.message : '로그인에 실패했습니다.',
      )
    }
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
            description="후보 정보와 공약을 등록합니다."
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
          <p>학생 계정 정보를 입력해 투표 화면에 접속합니다.</p>
        </SectionHeading>

        <Field>
          <span>아이디</span>
          <input
            autoComplete="username"
            onChange={(event) => setAccount(event.target.value)}
            value={account}
          />
        </Field>

        <Field>
          <span>비밀번호</span>
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
            onClick={() => setMessage('비밀번호 재설정은 담당자에게 문의하세요.')}
            type="button"
          >
            비밀번호 찾기
          </GhostLink>
        </LoginOptions>

        <PrimaryButton $full disabled={isSubmitting} type="submit">
          {isSubmitting ? '로그인 중' : '로그인'}
        </PrimaryButton>

        <NoticeBox>{message}</NoticeBox>

        <AuthSwitch>
          <span>아직 계정이 없나요?</span>
          <GhostLink onClick={() => navigate(ROUTES.signup)} type="button">
            회원가입
          </GhostLink>
        </AuthSwitch>
      </LoginCard>
    </Layout>
  )
}

const Layout = styled.section`
  display: grid;
  grid-template-columns: 580px 520px;
  gap: clamp(56px, 8vw, 120px);
  align-items: center;
  min-height: calc(100dvh - 82px);
  padding: clamp(18px, 5vh, 50px) 80px clamp(18px, 4vh, 40px);

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
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: clamp(520px, calc(100dvh - 166px), 748px);
  padding: clamp(32px, 5vh, 58px) 48px;
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
    margin: clamp(24px, 5vh, 52px) 0 0;
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
    height: auto;
    min-height: auto;
    padding: 36px 24px;
  }
`

const FeatureStrip = styled.div`
  display: grid;
  gap: clamp(18px, 2.8vh, 28px);
  width: 458px;
  margin-top: clamp(28px, 6vh, 66px);
  padding: clamp(24px, 4vh, 40px) 24px;
  background: #0b625c;
  border-radius: 8px;

  @media (max-width: 760px) {
    width: 100%;
    margin-top: 36px;
  }
`

const HeroFooter = styled.div`
  margin-top: auto;
  padding-top: 24px;

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
  gap: clamp(16px, 2.4vh, 26px);
  padding: clamp(28px, 4.2vh, 40px);
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

const AuthSwitch = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
`

export default LoginScreen

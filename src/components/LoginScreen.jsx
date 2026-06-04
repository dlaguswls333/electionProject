import { useState } from 'react'
import styled from 'styled-components'
import { getDauthConfig, startDauthLogin } from '../auth/dauth'
import { PrimaryButton, SectionHeading } from '../styles/primitives'
import FeatureItem from './FeatureItem'

function LoginScreen() {
  const [isStarting, setIsStarting] = useState(false)
  const [message, setMessage] = useState(
    'DAuth 계정 인증 후 선거 시스템 권한으로 접속합니다.',
  )
  const dauthConfig = getDauthConfig()
  const isDauthConfigured = Boolean(dauthConfig.clientId)

  async function handleDauthLogin() {
    setIsStarting(true)
    setMessage('DAuth 인가 페이지로 이동합니다.')

    try {
      await startDauthLogin()
    } catch (error) {
      setIsStarting(false)
      setMessage(
        error instanceof Error
          ? error.message
          : 'DAuth 로그인을 시작하지 못했습니다.',
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

      <LoginCard>
        <SectionHeading $compact>
          <h2>로그인</h2>
          <p>도담 계정으로 선거 시스템에 접속합니다.</p>
        </SectionHeading>

        <DauthIdentity>
          <DauthLogo>D</DauthLogo>
          <div>
            <strong>DAuth</strong>
            <span>도담도담 OAuth 인증</span>
          </div>
        </DauthIdentity>

        <AuthInfoList>
          <li>학생은 DAuth 학생 정보로 투표 화면에 연결됩니다.</li>
          <li>교사 또는 관리자 권한은 후보 등록과 집계 화면으로 연결됩니다.</li>
          <li>회원가입과 계정 관리는 도담 계정에서 진행합니다.</li>
        </AuthInfoList>

        <PrimaryButton
          $full
          disabled={!isDauthConfigured || isStarting}
          onClick={handleDauthLogin}
          type="button"
        >
          {isStarting ? '이동 중' : 'DAuth로 로그인'}
        </PrimaryButton>

        <NoticeBox $warning={!isDauthConfigured}>
          {isDauthConfigured
            ? message
            : 'VITE_DAUTH_CLIENT_ID 환경 변수를 설정해야 DAuth 로그인을 시작할 수 있습니다.'}
        </NoticeBox>
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

const LoginCard = styled.article`
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

const DauthIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  strong,
  span {
    display: block;
  }

  strong {
    color: #0f172a;
    font-size: 18px;
    line-height: 25px;
  }

  span {
    margin-top: 2px;
    color: #64748b;
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
  }
`

const DauthLogo = styled.span`
  display: grid;
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  place-items: center;
  color: #ffffff;
  font-size: 24px;
  font-weight: 900;
  background: #0f766e;
  border-radius: 8px;
`

const AuthInfoList = styled.ul`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
  list-style: none;

  li {
    position: relative;
    padding-left: 16px;
  }

  li::before {
    position: absolute;
    top: 8px;
    left: 0;
    width: 5px;
    height: 5px;
    background: #0f766e;
    border-radius: 50%;
    content: '';
  }
`

const NoticeBox = styled.p`
  min-height: 44px;
  margin: -8px 0 0;
  padding: 13px 18px;
  color: ${({ $warning }) => ($warning ? '#92400e' : '#64748b')};
  font-size: 12px;
  font-weight: 600;
  line-height: 17px;
  background: ${({ $warning }) => ($warning ? '#fffbeb' : '#f8fafc')};
  border: 1px solid ${({ $warning }) => ($warning ? '#fde68a' : '#e2e8f0')};
  border-radius: 8px;
`

export default LoginScreen

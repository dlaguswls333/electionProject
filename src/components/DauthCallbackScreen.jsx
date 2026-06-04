import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { completeDauthLogin } from '../auth/dauth'
import { ROUTES } from '../routes/routePaths'
import { PageContent, Panel, PrimaryButton, SectionHeading } from '../styles/primitives'

function DauthCallbackScreen({ onLogin }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code') || ''
  const state = searchParams.get('state') || ''
  const dauthError = searchParams.get('error') || ''
  const [status, setStatus] = useState({
    message: 'DAuth 인증 정보를 확인하고 있습니다.',
    type: 'loading',
  })

  useEffect(() => {
    let isMounted = true

    async function finishLogin() {
      if (dauthError) {
        setStatus({
          message: `DAuth 인증이 완료되지 않았습니다. (${dauthError})`,
          type: 'error',
        })
        return
      }

      if (!code || !state) {
        setStatus({
          message: 'DAuth 콜백에 code 또는 state 값이 없습니다.',
          type: 'error',
        })
        return
      }

      try {
        const user = await completeDauthLogin({ code, state })

        if (isMounted) {
          onLogin(user)
        }
      } catch (error) {
        if (!isMounted) {
          return
        }

        setStatus({
          message:
            error instanceof Error
              ? error.message
              : 'DAuth 로그인 처리 중 문제가 발생했습니다.',
          type: 'error',
        })
      }
    }

    finishLogin()

    return () => {
      isMounted = false
    }
  }, [code, dauthError, onLogin, state])

  return (
    <CallbackContent>
      <CallbackPanel>
        <DauthMark>D</DauthMark>
        <SectionHeading $compact>
          <h1>DAuth 로그인</h1>
          <p>도담 계정 인증 결과를 선거 시스템 계정으로 연결합니다.</p>
        </SectionHeading>

        <StatusBox $error={status.type === 'error'}>{status.message}</StatusBox>

        {status.type === 'error' && (
          <PrimaryButton onClick={() => navigate(ROUTES.login)} type="button">
            로그인으로 돌아가기
          </PrimaryButton>
        )}
      </CallbackPanel>
    </CallbackContent>
  )
}

const CallbackContent = styled(PageContent)`
  display: grid;
  place-items: center;
`

const CallbackPanel = styled(Panel)`
  display: grid;
  gap: 22px;
  width: min(100%, 460px);
  text-align: center;
`

const DauthMark = styled.div`
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin: 0 auto;
  color: #ffffff;
  font-size: 28px;
  font-weight: 900;
  background: #0f766e;
  border-radius: 8px;
`

const StatusBox = styled.p`
  margin: 0;
  padding: 14px 18px;
  color: ${({ $error }) => ($error ? '#991b1b' : '#0f766e')};
  font-size: 13px;
  font-weight: 700;
  line-height: 19px;
  background: ${({ $error }) => ($error ? '#fef2f2' : '#e6f7f3')};
  border: 1px solid ${({ $error }) => ($error ? '#fecaca' : '#99f6e4')};
  border-radius: 8px;
`

export default DauthCallbackScreen

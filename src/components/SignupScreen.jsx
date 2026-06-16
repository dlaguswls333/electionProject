import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ROUTES } from '../routes/routePaths'
import { Field, GhostLink, PrimaryButton, SectionHeading } from '../styles/primitives'

function SignupScreen({ onSignup }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('학생 계정을 생성합니다.')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!username.trim() || !password.trim() || !name.trim()) {
      setMessage('아이디, 비밀번호, 이름을 모두 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    setMessage('회원가입 요청을 보내는 중입니다.')

    try {
      await onSignup({
        name: name.trim(),
        password,
        username: username.trim(),
      })
      navigate(ROUTES.login, { replace: true })
    } catch (error) {
      setIsSubmitting(false)
      setMessage(
        error instanceof Error ? error.message : '회원가입에 실패했습니다.',
      )
    }
  }

  return (
    <SignupLayout>
      <SignupCard onSubmit={handleSubmit}>
        <SectionHeading $compact>
          <h2>회원가입</h2>
          <p>학생 계정을 생성한 뒤 로그인 화면으로 이동합니다.</p>
        </SectionHeading>

        <Field>
          <span>아이디</span>
          <input
            autoComplete="username"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
          />
        </Field>

        <Field>
          <span>비밀번호</span>
          <input
            autoComplete="new-password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </Field>

        <Field>
          <span>이름</span>
          <input
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </Field>

        <PrimaryButton $full disabled={isSubmitting} type="submit">
          {isSubmitting ? '가입 중' : '회원가입'}
        </PrimaryButton>

        <NoticeBox>{message}</NoticeBox>

        <AuthSwitch>
          <span>이미 계정이 있나요?</span>
          <GhostLink onClick={() => navigate(ROUTES.login)} type="button">
            로그인
          </GhostLink>
        </AuthSwitch>
      </SignupCard>
    </SignupLayout>
  )
}

const SignupLayout = styled.section`
  display: grid;
  min-height: calc(100dvh - 82px);
  padding: clamp(24px, 8vh, 80px) 24px;
  place-items: center;
`

const SignupCard = styled.form`
  display: grid;
  gap: clamp(16px, 2.4vh, 24px);
  width: min(100%, 520px);
  padding: clamp(28px, 4.2vh, 40px);
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 14px 15px rgba(15, 23, 42, 0.08);
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

export default SignupScreen

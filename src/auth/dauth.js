import { ROUTES } from '../routes/routePaths'

const AUTHORIZE_URL = 'https://dauth.b1nd.com/authorize'
const STORAGE_KEYS = {
  state: 'election.dauth.state',
  codeVerifier: 'election.dauth.code_verifier',
}

export function getDauthConfig() {
  const redirectUri =
    import.meta.env.VITE_DAUTH_REDIRECT_URI ||
    `${window.location.origin}${ROUTES.dauthCallback}`

  return {
    clientId: import.meta.env.VITE_DAUTH_CLIENT_ID || '',
    redirectUri,
    scope: import.meta.env.VITE_DAUTH_SCOPE || 'profile:read student:read',
    callbackEndpoint:
      import.meta.env.VITE_DAUTH_CALLBACK_ENDPOINT || '/api/auth/dauth/callback',
  }
}

export async function startDauthLogin() {
  const config = getDauthConfig()

  if (!config.clientId) {
    throw new Error('VITE_DAUTH_CLIENT_ID 환경 변수를 설정해 주세요.')
  }

  const state = createRandomString()
  const codeVerifier = createRandomString()
  const codeChallenge = await createCodeChallenge(codeVerifier)

  sessionStorage.setItem(STORAGE_KEYS.state, state)
  sessionStorage.setItem(STORAGE_KEYS.codeVerifier, codeVerifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  window.location.assign(`${AUTHORIZE_URL}?${params.toString()}`)
}

export async function completeDauthLogin({ code, state }) {
  const config = getDauthConfig()
  const storedState = sessionStorage.getItem(STORAGE_KEYS.state)
  const codeVerifier = sessionStorage.getItem(STORAGE_KEYS.codeVerifier)

  if (!storedState || storedState !== state) {
    clearDauthSession()
    throw new Error('DAuth state 검증에 실패했습니다. 다시 로그인해 주세요.')
  }

  if (!codeVerifier) {
    clearDauthSession()
    throw new Error('DAuth PKCE 정보가 없습니다. 다시 로그인해 주세요.')
  }

  const response = await fetch(config.callbackEndpoint, {
    body: JSON.stringify({
      code,
      state,
      redirectUri: config.redirectUri,
      codeVerifier,
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!response.ok) {
    const message = await readErrorMessage(response)

    throw new Error(
      message ||
        `DAuth 백엔드 콜백 API 호출에 실패했습니다. (${response.status})`,
    )
  }

  const payload = await response.json()

  clearDauthSession()

  return normalizeDauthUser(payload)
}

export function clearDauthSession() {
  sessionStorage.removeItem(STORAGE_KEYS.state)
  sessionStorage.removeItem(STORAGE_KEYS.codeVerifier)
}

function createRandomString(length = 48) {
  const bytes = new Uint8Array(length)

  crypto.getRandomValues(bytes)

  return base64UrlEncode(bytes)
}

async function createCodeChallenge(codeVerifier) {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(codeVerifier),
  )

  return base64UrlEncode(digest)
}

function base64UrlEncode(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input)
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return window
    .btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

async function readErrorMessage(response) {
  try {
    const payload = await response.json()

    return payload.message || payload.error || ''
  } catch {
    return ''
  }
}

function normalizeDauthUser(payload) {
  const user = payload.user || payload.data?.user || payload.data || payload
  const roles = Array.isArray(user.roles) ? user.roles : []
  const roleText = [user.role, ...roles].filter(Boolean).join(' ').toLowerCase()
  const student = user.student || null
  const studentClass = student?.room || student?.class
  const role =
    roleText.includes('admin') || roleText.includes('teacher') ? 'admin' : 'student'

  return {
    account: user.email || user.username || user.publicId || user.id || '',
    className:
      student?.grade && studentClass
        ? `${student.grade}학년 ${studentClass}반`
        : '대소고',
    dauth: user,
    name: user.name || user.username || user.email || 'DAuth 사용자',
    number: student?.number ? String(student.number) : '',
    role,
  }
}

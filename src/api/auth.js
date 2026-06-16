import { getApiUrl } from '../config/env'

const AUTH_SESSION_KEY = 'election.auth.session'

export async function login({ password, username }) {
  const payload = await requestJson('/api/auth/login', {
    body: JSON.stringify({
      password,
      username,
    }),
    method: 'POST',
  })

  return normalizeUser(payload, { username })
}

export async function signup({ name, password, username }) {
  return requestJson('/api/auth/signup', {
    body: JSON.stringify({
      name,
      password,
      username,
    }),
    method: 'POST',
  })
}

export function loadAuthSession() {
  return readStoredUser(window.sessionStorage) || readStoredUser(window.localStorage)
}

export function saveAuthSession(user, { remember }) {
  const storage = remember ? window.localStorage : window.sessionStorage
  const otherStorage = remember ? window.sessionStorage : window.localStorage

  otherStorage.removeItem(AUTH_SESSION_KEY)
  storage.setItem(AUTH_SESSION_KEY, JSON.stringify(user))
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_SESSION_KEY)
  window.sessionStorage.removeItem(AUTH_SESSION_KEY)
}

export function getAuthToken() {
  return loadAuthSession()?.accessToken || ''
}

async function requestJson(path, options) {
  let response

  try {
    response = await fetch(getApiUrl(path), {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
  } catch {
    throw new Error('서버에 연결할 수 없습니다. API 주소를 확인해 주세요.')
  }

  const payload = await readJson(response)

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload) || `요청에 실패했습니다. (${response.status})`,
    )
  }

  return payload
}

async function readJson(response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function getErrorMessage(payload) {
  if (!payload || typeof payload !== 'object') {
    return ''
  }

  return payload.message || payload.error || payload.reason || ''
}

function normalizeUser(payload, fallback) {
  const user = getUserPayload(payload)
  const account = user.username || user.account || user.email || fallback.username

  return {
    accessToken: user.accessToken || payload?.accessToken || '',
    account,
    className: normalizeClassName(user),
    id: user.id || user.userId || '',
    name: user.name || account,
    number: user.number ? String(user.number) : '',
    role: 'student',
  }
}

function readStoredUser(storage) {
  const value = storage.getItem(AUTH_SESSION_KEY)

  if (!value) {
    return null
  }

  try {
    return {
      ...JSON.parse(value),
      role: 'student',
    }
  } catch {
    storage.removeItem(AUTH_SESSION_KEY)
    return null
  }
}

function getUserPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {}
  }

  return payload.user || payload.data?.user || payload.data || payload
}

function normalizeClassName(user) {
  if (user.className) {
    return user.className
  }

  if (user.grade && user.room) {
    return `${user.grade}학년 ${user.room}반`
  }

  return '2학년 3반'
}

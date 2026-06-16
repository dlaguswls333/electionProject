const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || ''

export const env = {
  apiBaseUrl: stripTrailingSlash(rawApiBaseUrl),
}

export function getApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return env.apiBaseUrl
    ? `${env.apiBaseUrl}${normalizedPath}`
    : normalizedPath
}

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, '')
}

import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// vite.config.js
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || ''

  return {
    base: '/electionProject/',
    plugins: [react()],
    server: apiProxyTarget
      ? {
          proxy: {
            '/api': {
              changeOrigin: true,
              headers: {
                'ngrok-skip-browser-warning': 'true',
              },
              secure: false,
              target: apiProxyTarget,
            },
          },
        }
      : undefined,
  }
})

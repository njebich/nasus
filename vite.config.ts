import { defineConfig } from 'vite'
import { execFileSync } from 'node:child_process'

function getLastUpdatedAt(): string {
  if (process.env.VITE_LAST_UPDATED_AT) return process.env.VITE_LAST_UPDATED_AT

  try {
    return execFileSync('git', ['log', '-1', '--format=%cI'], { encoding: 'utf8' }).trim()
  } catch {
    return new Date().toISOString()
  }
}

export default defineConfig({
  base: '/nasus/',
  define: {
    __LAST_UPDATED_AT__: JSON.stringify(getLastUpdatedAt()),
  },
})

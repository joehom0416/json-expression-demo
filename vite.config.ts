import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

const jsonExprPkg = JSON.parse(
  readFileSync('node_modules/@nanotiny/json-expression/package.json', 'utf-8')
)

export default defineConfig({
  base: '/json-expression-demo/',
  plugins: [react()],
  define: {
    __JSON_EXPRESSION_VERSION__: JSON.stringify(jsonExprPkg.version),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
})

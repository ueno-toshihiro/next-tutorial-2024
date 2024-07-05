import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ["./setupTests.js"],
    coverage: {
      provider: 'v8', // or 'v8'
      include: ["app/**/*.{js,jsx,ts,tsx}"], // src配下のみを対象
      exclude: ["app/**/__mocks__/**"], // ディレクトリ除外
      all: true, // 未テストのコードもカバレッジに含める
      reporter: ['text', 'json', 'html'], // HTML,Clover,テキスト形式のカバレッジレポート
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    },
  },
})

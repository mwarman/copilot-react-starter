import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults, coverageConfigDefaults } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      exclude: ['./src/main.tsx', ...coverageConfigDefaults.exclude],
    },
    exclude: [...configDefaults.exclude, 'e2e/*'],
  },
});

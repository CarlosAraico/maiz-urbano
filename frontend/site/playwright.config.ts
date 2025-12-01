import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests',
  timeout: 60000,
  retries: 0,
  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview:facturacion',
    url: 'http://localhost:5173/facturacion/login',
    reuseExistingServer: !process.env.CI
  }
});

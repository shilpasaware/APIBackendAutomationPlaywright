// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // API testing specific settings
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },

  // Configure projects for API testing
  projects: [
    {
      name: 'api-tests',
      testMatch: '**/*.spec.js',
    },
    
    {
      name: 'performance-tests',
      testMatch: '**/*performance*.spec.js',
      use: {
        // Performance tests might need different timeouts
        timeout: 30000,
      },
    },
  ],

  // Global timeout for each test
  timeout: 30000,
  
  // Global timeout for the whole test run
  globalTimeout: 10 * 60 * 1000, // 10 minutes
  
  // Expect timeout
  expect: {
    timeout: 10000,
  },
});
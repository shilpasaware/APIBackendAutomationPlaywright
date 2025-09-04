// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Enhanced reporter configuration
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: 'never'  // Don't auto-open browser
    }],
    ['json', { 
      outputFile: 'test-results/test-results.json' 
    }],
    ['line'],
    ['junit', { 
      outputFile: 'test-results/junit.xml' 
    }]
  ],
  
  // Output directories
  outputDir: 'test-results',
  
  use: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  
  projects: [
    {
      name: 'API Tests',
      testDir: './tests/api',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
      },
    },
  ],
  
  // Global setup (optional - can be commented out if causing issues)
  // globalSetup: './utils/global-setup.js',
});
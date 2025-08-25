import { defineConfig, devices } from '@playwright/test';
import isCI from 'ci-info';

export default defineConfig({
    testIgnore: isCI.isCI ? ['**/tests/payment.spec.ts'] : [],
    // testIgnore: isCI ? ['**/tests/payment.spec.ts'] : [],
    // retries: 1,
    fullyParallel:false,
    // grep:/@sanity/,
    //  grep:/(?=.*'@sanity')(?=.*'@regression')/,
    //  grepInvert: /'@regression'/,



    // timeout: 50000, // Increased auto wait time to 5000 milliseconds
    // expect:{timeout:10000},
    reporter: [['github'], ['html', { open: 'never' }]],
    use: {
        headless: true,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        // video: 'retain-on-failure', // Take video on failure

    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
});

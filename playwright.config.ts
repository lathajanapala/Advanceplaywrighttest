import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    // retries: 1,
    fullyParallel:false,
    // grep:/@sanity/,
    //  grep:/(?=.*'@sanity')(?=.*'@regression')/,
    //  grepInvert: /'@regression'/,



    // timeout: 50000, // Increased auto wait time to 5000 milliseconds
    // expect:{timeout:10000},
       reporter: [['html'], ['list']],
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

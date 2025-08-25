import { test, expect } from '@playwright/test';
test.describe('Group1',async()=>{

    test('Test 1: Check title of example.com', async ({ page }) => {
        await page.goto('https://example.com');
        await expect(page).toHaveTitle('Example Domain');
    });

    test('Test 2: Check presence of heading on example.com', async ({ page }) => {
        await page.goto('https://example.com');
        const heading = await page.locator('h1');
        await expect(heading).toHaveText('Example Domain');
    });
})
test.describe('Group2',async()=>{
    test('Test 3: Navigate to playwright.dev and check title', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});
test.describe('Group3',async()=>{
    test('Test 4: Check presence of Get Started link on playwright.dev', async ({ page }) => {
        await page.goto('https://playwright.dev');
        const getStarted =page.locator('text=Get Started');
        await expect(getStarted).toBeVisible();
    });


    test('Test 5: Navigate to google.com and check title contains Google', async ({ page }) => {
        await page.goto('https://www.google.com');
        await expect(page).toHaveTitle(/Google/);
    });

    test('Test 6: Search for Playwright on Google', async ({ page }) => {
        await page.goto('https://www.google.com');
        const searchBox =page.locator('textarea[name="q"]');
        await searchBox.fill('Playwright');
        await searchBox.press('Enter');
        await page.waitForTimeout(2000); // Wait for results to load
        const results = page.getByText('Playwright');
        await expect(results).toBeVisible();
    });
});
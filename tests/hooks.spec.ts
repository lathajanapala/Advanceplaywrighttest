import { test, expect } from '@playwright/test';

test.describe('Hooks Example', () => {
    // Runs once before all tests
    test.beforeAll(async () => {
        console.log('Setting up before all tests');
    });

    // Runs once after all tests
    test.afterAll(async () => {
        console.log('Cleaning up after all tests');
    });

    // Runs before each test
    test.beforeEach(async ({ page }) => {
        console.log('Setting up before each test');
        await page.goto('https://example.com');
    });

    // Runs after each test
    test.afterEach(async ({ page }) => {
        console.log('Cleaning up after each test');
        await page.close();
    });

    test('Test 1: Check page title', async ({ page }) => {
        const title = await page.title();
        expect(title).toBe('Example Domain');
    });

    test('Test 2: Check heading text', async ({ page }) => {
        const heading = await page.locator('h1').textContent();
        expect(heading).toBe('Example Domain');
    });

    test('Test 3: Check paragraph text', async ({ page }) => {
        const paragraph = await page.locator('p').nth(0).textContent();
        expect(paragraph).toContain('illustrative examples');
    });

    test('Test 4: Check link href', async ({ page }) => {
        const href = await page.locator('a').getAttribute('href');
        expect(href).toBe('https://www.iana.org/domains/example');
    });

    test('Test 5: Check link text', async ({ page }) => {
        const linkText = await page.locator('a').textContent();
        expect(linkText).toBe('More information...');
    });
});
import { test, expect } from '@playwright/test';

const baseURL = 'https://demoblaze.com/';
const username = 'pushpalatha';
const password = 'Test@2025';

test.describe('E-commerce site tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL);
        await page.waitForLoadState('domcontentloaded');
    });
});


test.describe('Login and Logout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL);
        await page.locator('#login2').click();
        await page.fill('#loginusername', username);
        await page.fill('#loginpassword', password);
        await page.locator('button:has-text("Log in")').click();
        await page.waitForSelector('#nameofuser');
    });

    test('Login validation', async ({ page }) => {
        const welcomeText = await page.locator('#nameofuser').innerText();
        expect(welcomeText).toContain(username);
    });

    test('Logout validation', async ({ page }) => {
        await page.locator('#logout2').click();
        await page.waitForSelector('#login2');
        expect(await page.locator('#login2').isVisible()).toBeTruthy();
    });
});
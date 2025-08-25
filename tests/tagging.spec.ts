// tests/demoblaze.spec.ts
import { test, expect, Page } from '@playwright/test';

const baseURL = 'https://demoblaze.com/';
// create unique creds per run
const runId = Date.now();
const username = `qa_${runId}`;
const password = 'Qa!2025_demo';

// ---------- helpers ----------
async function openHome(page: Page) {
  await page.goto(baseURL);
  await page.waitForLoadState('domcontentloaded');
}

async function signUp(page: Page, user: string, pass: string) {
  await openHome(page);
  await page.locator('#signin2').click();
  await page.waitForSelector('#signInModal', { state: 'visible' });
  await page.fill('#sign-username', user);
  await page.fill('#sign-password', pass);
  const [dlg] = await Promise.all([
    page.waitForEvent('dialog'),
    page.locator('button:has-text("Sign up")').click(),
  ]);
  // Expect either success or “already exists” if re-run
  const msg = dlg.message().toLowerCase();
  expect(msg).toMatch(/success|exist/);
  await dlg.accept();
}

async function login(page: Page, user: string, pass: string) {
  await openHome(page);
  await page.locator('#login2').click();
  await page.waitForSelector('#logInModal', { state: 'visible' });
  await page.fill('#loginusername', user);
  await page.fill('#loginpassword', pass);
  await page.locator('button:has-text("Log in")').click();
  await expect(page.locator('#nameofuser')).toContainText(user, { timeout: 10000 });
}

async function logoutIfLoggedIn(page: Page) {
  if (await page.locator('#logout2').isVisible().catch(() => false)) {
    await page.locator('#logout2').click();
    await expect(page.locator('#login2')).toBeVisible();
  }
}

async function getVisibleProductCards(page: Page) {
  // Home/catalog grid
  const cards = page.locator('#tbodyid .card');
  await expect(cards.first()).toBeVisible();
  return cards;
}

async function mapProductsOnCurrentPage(page: Page) {
  const cards = await getVisibleProductCards(page);
  const count = await cards.count();
  const mapping: Record<string, number> = {};
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    // Demoblaze card structure: h4.card-title > a, price in h5
    const name = (await card.locator('h4.card-title a').innerText()).trim();
    const priceText = (await card.locator('h5').innerText()).trim(); // e.g., $360
    const num = Number(priceText.replace(/[^\d.]/g, ''));
    mapping[name] = num;
  }
  return mapping;
}

// ---------------- test suite ----------------
test.describe('Demoblaze - E2E Suite', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await openHome(page);
  });

  // Create account once per worker so login can succeed
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await signUp(page, username, password);
    await page.close();
  });

  // ============ GROUP 1: Login & Logout ============
  test.describe('@auth @sanity @regression - Login & Logout', () => {
    test('1) Successful login shows username', async ({ page }) => {
      await login(page, username, password);
      await expect(page.locator('#nameofuser')).toContainText(username);
    });

    test('2) Logout hides username and shows Login button', async ({ page }) => {
      await login(page, username, password);
      await page.locator('#logout2').click();
      await expect(page.locator('#login2')).toBeVisible();
      await expect(page.locator('#nameofuser')).toBeHidden();
    });

    test('3) Invalid login shows alert', async ({ page }) => {
      await openHome(page);
      await page.locator('#login2').click();
      await page.waitForSelector('#logInModal', { state: 'visible' });
      await page.fill('#loginusername', 'does_not_exist_' + runId);
      await page.fill('#loginpassword', 'badpass');
      const [dlg] = await Promise.all([
        page.waitForEvent('dialog'),
        page.locator('button:has-text("Log in")').click(),
      ]);
      expect(dlg.message().toLowerCase()).toMatch(/user|not exist|wrong/);
      await dlg.accept();
    });

    test('4) Login persists after refresh (same session)', async ({ page }) => {
      await login(page, username, password);
      await page.reload();
      await expect(page.locator('#nameofuser')).toContainText(username);
      await logoutIfLoggedIn(page);
    });
  });

  // ============ GROUP 2: Catalog (login before group) ============
  test.describe('@catalog - List, Map, Filter', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, username, password);
    });

    test('5) Map products (name → price) on the first page', async ({ page }) => {
      const mapping = await mapProductsOnCurrentPage(page);
      expect(Object.keys(mapping).length).toBeGreaterThan(0);
      for (const [name, price] of Object.entries(mapping)) {
        expect(name).not.toEqual('');
        expect(price).toBeGreaterThan(0);
      }
      console.log('Page 1 mapping:', mapping);
    });

    test('6) Paginate and accumulate product map across pages', async ({ page }) => {
      const all: Record<string, number> = {};
      Object.assign(all, await mapProductsOnCurrentPage(page));

      const next = page.locator('button:has-text("Next")');
      if (await next.isVisible()) {
        await next.click();
        await expect(page.locator('#tbodyid .card').first()).toBeVisible();
        Object.assign(all, await mapProductsOnCurrentPage(page));
      }

      expect(Object.keys(all).length).toBeGreaterThan(0);
      for (const [name, price] of Object.entries(all)) {
        expect(name).not.toEqual('');
        expect(price).toBeGreaterThan(0);
      }
      console.log('All pages mapping:', all);
    });

    test('7) Filter by "Laptops" category shows only laptops', async ({ page }) => {
      await page.locator('a.list-group-item:has-text("Laptops")').click();
      await expect(page.locator('#tbodyid .card').first()).toBeVisible();
      const cards = await getVisibleProductCards(page);
      const names: string[] = [];
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        names.push((await cards.nth(i).locator('h4.card-title a').innerText()).trim());
      }
      expect(names.length).toBeGreaterThan(0);
      expect(names.some(n => /macbook|vaio|dell|hp|asus|lenovo/i.test(n))).toBeTruthy();
    });

    test('8) Product price format looks like $<number>', async ({ page }) => {
      const cards = await getVisibleProductCards(page);
      const count = await cards.count();
      for (let i = 0; i < count; i++) {
        const priceText = (await cards.nth(i).locator('h5').innerText()).trim();
        expect(priceText).toMatch(/^\$\s*\d+(?:\.\d+)?$/);
      }
    });
  });

  // ============ GROUP 3: Cart & Checkout ============
  test.describe('@cart - Add to Cart & Checkout', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, username, password);
    });

    test('9) Add a product to cart and verify in cart', async ({ page }) => {
      const productName = 'Samsung galaxy s6';
      await page.locator(`h4.card-title a:has-text("${productName}")`).first().click();
      await page.waitForSelector('a:has-text("Add to cart")');
      const [dlg] = await Promise.all([
        page.waitForEvent('dialog'),
        page.locator('a:has-text("Add to cart")').click(),
      ]);
      expect(dlg.message().toLowerCase()).toContain('added');
      await dlg.accept();

      await page.locator('#cartur').click();
      await page.waitForSelector('#tbodyid');
      await expect(page.locator('#tbodyid td:has-text("Samsung galaxy s6")')).toBeVisible();
    });

    test('10) Place order from cart: fill card details and verify confirmation', async ({ page }) => {
      // Ensure an item exists in cart
      await page.locator('#cartur').click();
      const hasRow = await page.locator('#tbodyid tr').first().isVisible().catch(() => false);
      if (!hasRow) {
        await openHome(page);
        await page.locator('h4.card-title a:has-text("Samsung galaxy s6")').first().click();
        const [dlg] = await Promise.all([
          page.waitForEvent('dialog'),
          page.locator('a:has-text("Add to cart")').click(),
        ]);
        await dlg.accept();
        await page.locator('#cartur').click();
      }

      await page.locator('button:has-text("Place Order")').click();
      await page.waitForSelector('#orderModal', { state: 'visible' });
      await page.fill('#name', 'Ram Munagala');
      await page.fill('#country', 'USA');
      await page.fill('#city', 'Santa Clara');
      await page.fill('#card', '4111111111111111');
      await page.fill('#month', '12');
      await page.fill('#year', '2027');
      await page.locator('button:has-text("Purchase")').click();

      const sweet = page.locator('.sweet-alert, .showSweetAlert');
      await expect(sweet).toBeVisible();
      const text = await sweet.innerText();
      expect(text).toMatch(/Id:\s*\d+/i);
      expect(text).toMatch(/Amount:\s*\d+/i);
      await page.locator('button.confirm').click();
    });
  });
});

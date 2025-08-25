import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://demoblaze.com/');
  await expect(page.getByRole('link', { name: 'PRODUCT STORE' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  await page.getByRole('link', { name: 'Sign up' }).click();
  const randomEmail = `user${Math.floor(Math.random() * 10000)}@example.com`;
  await page.getByRole('textbox', { name: 'Username:' }).fill(randomEmail);
  await page.getByRole('textbox', { name: 'Password:' }).fill('password123');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page.getByRole('link', { name: 'Samsung galaxy s6' })).toBeVisible();
  await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();
  await page.getByRole('heading', { name: '$360 *includes tax' }).click();
  await expect(page.locator('h2')).toMatchAriaSnapshot(`- heading "Samsung galaxy s6" [level=2]`);
  await page.locator('#imgp img').click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('link', { name: 'Add to cart' }).click();
  await expect(page.locator('#cartur')).toContainText('Cart');
  await page.getByRole('link', { name: 'Cart', exact: true }).click();
  await expect(page.getByRole('row', { name: 'Samsung galaxy s6 360 Delete' }).getByRole('img')).toBeVisible();
  await page.getByRole('button', { name: 'Place Order' }).click();
  await page.getByRole('textbox', { name: 'Name:' }).fill('John Doe');
  await page.getByRole('textbox', { name: 'Country:' }).fill('USA');
  await page.getByRole('textbox', { name: 'City:' }).fill('New York');
  await page.getByRole('textbox', { name: 'Credit card:' }).fill('1234 5678 9012 3456');
  await page.getByRole('textbox', { name: 'Month:' }).fill('12');
  await page.getByRole('textbox', { name: 'Year:' }).fill('2025');
  await page.getByRole('button', { name: 'Purchase' }).click();
  const confirmationMessage = await page.locator('h2:has-text("Thank you for your purchase!")').textContent();
  console.log(`Confirmation Message: ${confirmationMessage}`);
  const orderDetails = await page.locator('.lead.text-muted').textContent();
  console.log(`Order Details: ${orderDetails}`);
    await page.getByRole('button', { name: 'OK' }).click();
  });

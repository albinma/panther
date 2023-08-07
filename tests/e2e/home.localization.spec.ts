import { test, expect } from '@playwright/test';
import enMessages from '../../messages/en.json';
import frMessages from '../../messages/fr.json';

test('should handle i18n routing', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');
  await expect(page).toHaveTitle(enMessages.LocalLayout.title);

  // A cookie remembers the last locale
  await page.goto('/fr');
  await page.goto('/');
  await expect(page).toHaveURL('/fr');
  await expect(page).toHaveTitle(frMessages.LocalLayout.title);
});

test("should handles not found pages for routes that don't match the middleware", async ({
  page,
}) => {
  await page.goto('/test.png');
  page.getByRole('heading', { name: 'This page could not be found.' });
  await page.goto('/api/hello');
  page.getByRole('heading', { name: 'This page could not be found.' });
});

test('should sets locale cookie', async ({ page }) => {
  const response = await page.goto('/');
  const value = await response?.headerValue('set-cookie');
  expect(value).toContain('NEXT_LOCALE=en;');
  expect(value).toContain('Path=/;');
  expect(value).toContain('SameSite=strict');
  expect(value).toContain('Max-Age=31536000;');
  expect(value).toContain('Expires=');
});

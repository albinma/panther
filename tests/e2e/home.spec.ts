import { test, expect } from '@playwright/test';

test('should navigate to home page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');
});

test('should toggle themes', async ({ page }) => {
  await page.goto('/');
  const button = page.getByTestId('theme-switcher');
  await expect(page.locator('html')).toHaveClass('light');
  await button.click();
  await expect(page.locator('html')).toHaveClass('dark');
  await button.click();
  await expect(page.locator('html')).toHaveClass('light');
});

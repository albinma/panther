import { test, expect } from '@playwright/test';

test('should navigate to health page and be healthy', async ({ page }) => {
  await page.goto('/health');
  await expect(page).toHaveURL('/health');
  const p = page.getByTestId('health-status');
  await expect(p).toHaveText('healthy');
});

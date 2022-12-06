import { test, expect, ElementHandle } from '@playwright/test';

test.describe('ARIA MenuBar tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/');

    // Skip if there are no menubars on the page
    const menubar = page.getByRole('menubar');
    test.skip(await menubar.count() === 0);
  });

  test('Tab to focus into the menubar', async ({ page }) => {
    await page.keyboard.press('Tab');
    let focused = page.getByRole('menubar').locator(':focus',);
    while(await focused.count() === 0) {
      await page.keyboard.press('Tab');
      focused = page.getByRole('menubar').locator(':focus',);
    }
    await expect(focused).toBeFocused();
    await expect(focused).toHaveAttribute('role', 'menuitem');
  });

  test('Tab to blur out of the menubar', async ({ page }) => {
    await page.getByRole('menubar').locator('[tabindex="0"]').focus();
    await page.keyboard.press('Tab');
    const focused = page.getByRole('menubar').locator(':focus');
    await expect(focused).toHaveCount(0);
  });

  test('Left-arrow navigation through top menu items', async ({ page }) => {
    await page.getByRole('menubar').locator('[tabindex="0"]').focus();
    const firstElementHandle = await page.evaluateHandle(() => document.activeElement);
    let lastFocusedElementHandle = await page.evaluateHandle(() => document.activeElement);
    await expect(page.locator(':focus')).toHaveAttribute('role', 'menuitem');
    await page.keyboard.press('ArrowLeft');
    while(await page.evaluate((firstElement) => firstElement !== document.activeElement, firstElementHandle)) {
      await expect(page.locator(':focus')).toHaveAttribute('role', 'menuitem');
      expect(await page.evaluate((element) => element !== document.activeElement, lastFocusedElementHandle)).toBeTruthy();
      await page.keyboard.press('ArrowLeft');
    }
  });

  test('Right-arrow navigation through top menu items', async ({ page }) => {
    await page.getByRole('menubar').locator('[tabindex="0"]').focus();
    const firstElementHandle = await page.evaluateHandle(() => document.activeElement);
    let lastFocusedElementHandle = await page.evaluateHandle(() => document.activeElement);
    await expect(page.locator(':focus')).toHaveAttribute('role', 'menuitem');
    await page.keyboard.press('ArrowRight');
    while(await page.evaluate((firstElement) => firstElement !== document.activeElement, firstElementHandle)) {
      await expect(page.locator(':focus')).toHaveAttribute('role', 'menuitem');
      expect(await page.evaluate((element) => element !== document.activeElement, lastFocusedElementHandle)).toBeTruthy();
      await page.keyboard.press('ArrowRight');
    }
  });

  test('Activate top-level menu item', async ({ page }) => {

  });
});

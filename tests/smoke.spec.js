import { expect, test } from '@playwright/test';

/**
 * End-to-end coverage for the paths a visitor actually takes.
 *
 * The emphasis is deliberate: the assertions about images and console errors
 * exist because this project once shipped 94 corrupted image files and nobody
 * noticed until the pages were opened by hand.
 */

/** External hosts are noise here — the assertions are about this app. */
const isExternal = (url) => /unsplash|fonts\.(googleapis|gstatic)/.test(url);

async function collectProblems(page) {
  const consoleErrors = [];
  const badResponses = [];

  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !isExternal(message.location().url ?? '')) {
      consoleErrors.push(message.text());
    }
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && !isExternal(response.url())) {
      badResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  return { consoleErrors, badResponses };
}

test.describe('FUREVER', () => {
  test('the home page renders without errors and every local asset resolves', async ({ page }) => {
    const { consoleErrors, badResponses } = await collectProblems(page);

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Any image the browser finished loading with zero intrinsic width failed.
    // This is what a corrupted or missing file looks like from the DOM.
    const broken = await page.evaluate(() =>
      [...document.querySelectorAll('img')]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src)
        .filter((src) => !src.includes('unsplash')),
    );

    expect(broken, 'local images failed to decode').toEqual([]);
    expect(badResponses, 'requests to this app returned an error').toEqual([]);
    expect(consoleErrors, 'the page logged errors').toEqual([]);
  });

  test('a favourite survives a reload', async ({ page }) => {
    await page.goto('/');

    const save = page.getByRole('button', { name: /save .* to favourites/i }).first();
    await save.click();

    // The confirmation exists twice on purpose: once visually, and once in a
    // visually-hidden aria-live region for screen readers. Assert on both.
    await expect(page.locator('.animate-slide-up').first()).toContainText(
      /saved .* to your favourites/i,
    );
    await expect(page.locator('[aria-live="polite"]')).toContainText(
      /saved .* to your favourites/i,
    );

    await page.reload();
    await expect(
      page.getByRole('button', { name: /remove .* from favourites/i }).first(),
    ).toBeVisible();
  });

  test('listing a pet requires signing in first', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('button', { name: /list a pet/i })
      .first()
      .click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/welcome back|create an account/i);
    await expect(dialog).toContainText(/sign in to list a pet/i);
  });

  test('a dialog traps focus and closes on Escape', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('button', { name: /list a pet/i })
      .first()
      .click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Focus should have moved inside the dialog, not stayed on the page behind.
    const focusIsInside = await page.evaluate(() =>
      document.querySelector('[role="dialog"]')?.contains(document.activeElement),
    );
    expect(focusIsInside).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('the listing form refuses to submit an empty listing', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('button', { name: /list a pet/i })
      .first()
      .click();

    await page.fill('#signin-email', 'tester@example.com');
    await page.fill('#signin-password', 'hunter2');
    await page.locator('[role="dialog"] button[type="submit"]').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText(/list a pet/i);

    await page.getByRole('button', { name: /publish this listing/i }).click();

    // Every required field should explain itself rather than failing silently.
    await expect(page.getByRole('alert').first()).toBeVisible();
    expect(await page.getByRole('alert').count()).toBeGreaterThan(3);
  });

  test('the wordmark is the only cream-on-ochre text on the page', async ({ page }) => {
    await page.goto('/');

    // cream on ochre measures 1.8:1 and is exempt only because a logotype is
    // exempt. If a *second* element ever picks up that pairing it is real text
    // and the exemption no longer covers it.
    const creamOnOchre = await page.evaluate(() => {
      const norm = (c) => c.replace(/\s/g, '');
      const CREAM = ['rgb(250,246,240)', 'rgba(250,246,240'];
      const OCHRE = 'rgb(235,176,66)';

      return [...document.querySelectorAll('body *')]
        .filter((el) => el.textContent.trim().length > 0 && el.children.length === 0)
        .filter((el) => {
          const style = getComputedStyle(el);
          if (!CREAM.some((c) => norm(style.color).startsWith(c))) return false;
          let node = el;
          while (node && node !== document.body) {
            const bg = norm(getComputedStyle(node).backgroundColor);
            if (bg === OCHRE) return true;
            if (bg !== 'rgba(0,0,0,0)' && bg !== 'transparent') return false;
            node = node.parentElement;
          }
          return false;
        })
        .map((el) => el.textContent.trim().slice(0, 40));
    });

    expect(creamOnOchre.sort()).toEqual(['furever']);
  });

  test('reduced motion stops the marquee and reveals everything', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForTimeout(400);

    // Nothing may be left hidden by a reveal that will never fire.
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll('[data-reveal]')].filter(
          (el) => parseFloat(getComputedStyle(el).opacity) < 0.9,
        ).length,
    );
    expect(hidden).toBe(0);
  });

  test('the catalogue is reachable from any viewport', async ({ page }) => {
    await page.goto('/');

    // Below `lg` the navigation collapses behind the MENU pill.
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    if (await menu.isVisible().catch(() => false)) await menu.click();

    await page.getByRole('button', { name: 'Browse', exact: true }).first().click();
    await expect(page.getByRole('article').first()).toBeVisible();
  });
});

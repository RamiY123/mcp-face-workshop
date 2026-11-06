import { test, expect } from '@playwright/test';
test('expression animation leaves the card, returns, and can replay the same reaction', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('#connection')).toContainText('Connected');
  await expect(page.locator('#face')).toHaveAttribute('src', /svg$/);
  await expect(page.locator('.reaction-overlay')).toHaveCount(0);
  for (let repeat = 0; repeat < 2; repeat++) {
    const response = await request.post('/api/expression', { data: { name: 'angry', source: 'mcp' } });
    expect(await response.json()).toMatchObject({ displayed: true });
    await expect(page.locator('.face-popout')).toHaveCount(1);
    // Freeze the Web Animation at its peak to inspect geometry without timing races.
    await page.locator('.face-popout').evaluate(el => { const animation = el.getAnimations()[0]; animation.pause(); animation.currentTime = Number(animation.effect!.getTiming().duration) * .31; });
    const card = (await page.locator('.stage').boundingBox())!;
    const flying = (await page.locator('.face-popout').boundingBox())!;
    expect(flying.y < card.y || flying.x + flying.width > card.x + card.width).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (!repeat) await page.screenshot({ path: 'test-results/face-popout.png' });
    await page.locator('.face-popout').evaluate(el => el.getAnimations()[0].finish());
    await expect(page.locator('.reaction-overlay')).toHaveCount(0);
    await expect(page.locator('#face')).toHaveCSS('opacity', '1');
  }
});
test('rapid expression commands replace the effect and reduced motion keeps the face still', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('#face')).toHaveAttribute('src', /svg$/);
  for (const name of ['happy', 'shocked', 'love']) {
    await request.post('/api/expression', { data: { name } });
    await expect(page.locator('.reaction-overlay')).toHaveCount(1);
  }
  await expect(page.locator('#current')).toHaveText('Love');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.reaction-overlay')).toHaveCount(0);
  const response = await request.post('/api/expression', { data: { name: 'angry' } });
  expect(await response.json()).toMatchObject({ displayed: true });
  await expect(page.locator('#current')).toHaveText('Angry');
  await expect(page.locator('.reaction-overlay')).toHaveCount(0);
  await expect(page.locator('#face')).toHaveCSS('opacity', '1');
});

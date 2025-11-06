import { test } from '@playwright/test';

test('Performance and UX metrics', async ({ page }) => {
  // Navigate and measure load time
  const startTime = Date.now();
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;

  console.log('\n=== PERFORMANCE METRICS ===');
  console.log(`Page Load Time: ${loadTime}ms`);

  // Get performance metrics
  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
      loadComplete: Math.round(perfData.loadEventEnd - perfData.fetchStart),
      domInteractive: Math.round(perfData.domInteractive - perfData.fetchStart),
      firstPaint: Math.round(perfData.responseStart - perfData.fetchStart)
    };
  });

  console.log(`DOM Content Loaded: ${metrics.domContentLoaded}ms`);
  console.log(`Load Complete: ${metrics.loadComplete}ms`);
  console.log(`DOM Interactive: ${metrics.domInteractive}ms`);
  console.log(`First Paint: ${metrics.firstPaint}ms`);

  // Test animation smoothness by adding a task
  console.log('\n=== ANIMATION TESTING ===');
  const animStart = Date.now();
  await page.click('button:has-text("Add Task")');
  await page.waitForSelector('input[placeholder*="Enter task title"]', { timeout: 3000 });
  const modalOpenTime = Date.now() - animStart;
  console.log(`Modal Open Animation: ${modalOpenTime}ms`);

  await page.fill('input[placeholder*="Enter task title"]', 'Performance Test Task');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const submitStart = Date.now();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  const submitTime = Date.now() - submitStart;
  console.log(`Task Submit Animation: ${submitTime}ms`);

  // Check visual smoothness
  console.log('\n=== VISUAL QUALITY ===');
  const cardExists = await page.locator('article:has-text("Performance Test Task")').count();
  console.log(`Task Card Rendered: ${cardExists > 0 ? 'YES' : 'NO'}`);

  // Test hover responsiveness
  if (cardExists > 0) {
    const hoverStart = Date.now();
    await page.hover('article:has-text("Performance Test Task")');
    await page.waitForTimeout(100);
    const hoverTime = Date.now() - hoverStart;
    console.log(`Hover Response Time: ${hoverTime}ms`);
  }

  console.log('\n=== TEST COMPLETE ===\n');
});

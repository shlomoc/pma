import { test } from '@playwright/test';

test('Manual testing with proper selectors', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);

  console.log('Starting manual test...');

  // Test 1: Add one task
  try {
    // Click first Add Task button
    await page.click('button:has-text("Add Task")');
    await page.waitForTimeout(1000);

    // Wait for modal and fill
    await page.waitForSelector('input[placeholder*="Enter task title"]', { timeout: 5000 });
    await page.fill('input[placeholder*="Enter task title"]', 'Design Homepage Mockups');
    await page.fill('textarea[placeholder*="Add notes"]', 'Create wireframes and high-fidelity mockups for the homepage redesign project');

    // Submit via Enter or clicking the submit button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    console.log('Task 1 added');

    // Take screenshot
    await page.screenshot({
      path: '/tmp/manual-test-one-task.png',
      fullPage: true
    });
  } catch (error) {
    console.log('Error adding task:', error);
  }

  // Test 2: Responsive screenshots
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'large', width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `/tmp/manual-test-${vp.name}-${vp.width}.png`,
      fullPage: true
    });
    console.log(`${vp.name} screenshot saved`);
  }

  console.log('All manual tests complete!');
});

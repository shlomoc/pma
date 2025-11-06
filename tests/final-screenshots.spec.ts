import { test } from '@playwright/test';

test('Create comprehensive screenshot set', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);

  // 1. Add tasks to create a populated board
  const tasksToAdd = [
    { column: 0, title: 'Design Homepage Mockups', desc: 'Create wireframes and high-fidelity mockups for the homepage redesign project' },
    { column: 0, title: 'Implement User Authentication', desc: 'Add login, signup, and password reset functionality with JWT tokens' },
    { column: 1, title: 'Setup PostgreSQL Database', desc: 'Configure database schema and migrations for production environment' },
    { column: 1, title: 'Write API Integration Tests', desc: 'Add comprehensive unit and integration tests for all API endpoints' },
    { column: 2, title: 'Deploy to Production', desc: 'Setup CI/CD pipeline and deploy application to production servers' },
  ];

  for (const task of tasksToAdd) {
    const buttons = await page.locator('button:has-text("Add Task")').all();
    if (buttons[task.column]) {
      await buttons[task.column].click();
      await page.waitForTimeout(800);

      // Fill in the modal form - use more specific selectors
      const modal = page.locator('div[role="dialog"]');
      await modal.locator('input').fill(task.title);
      await modal.locator('textarea').fill(task.desc);

      // Click the blue Add Task button in modal
      await modal.locator('button:has-text("Add Task")').click();
      await page.waitForTimeout(1200);
    }
  }

  // 2. Desktop view with tasks
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: '/tmp/final-desktop-1280-with-tasks.png',
    fullPage: true
  });
  console.log('Desktop 1280px screenshot saved');

  // 3. Large desktop view
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: '/tmp/final-desktop-1920-with-tasks.png',
    fullPage: true
  });
  console.log('Desktop 1920px screenshot saved');

  // 4. Tablet view with tasks
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: '/tmp/final-tablet-768-with-tasks.png',
    fullPage: true
  });
  console.log('Tablet screenshot saved');

  // 5. Mobile view with tasks
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: '/tmp/final-mobile-375-with-tasks.png',
    fullPage: true
  });
  console.log('Mobile screenshot saved');

  // 6. Back to desktop for hover effect
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(500);

  const taskCard = page.locator('article').first();
  await taskCard.hover();
  await page.waitForTimeout(400);

  await page.screenshot({
    path: '/tmp/final-hover-effect.png',
    fullPage: true
  });
  console.log('Hover effect screenshot saved');

  // 7. Open modal for animation
  const addButtons = await page.locator('button:has-text("Add Task")').all();
  if (addButtons[0]) {
    await addButtons[0].click();
    await page.waitForTimeout(600);

    await page.screenshot({
      path: '/tmp/final-modal-animation.png',
      fullPage: true
    });
    console.log('Modal animation screenshot saved');
  }

  console.log('\nAll screenshots completed successfully!');
});

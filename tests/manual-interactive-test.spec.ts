import { test } from '@playwright/test';

test.describe('Kanban Board - Manual Interactive Tests', () => {

  test('Add tasks manually and take screenshots', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Find and click the "Add Task" button in TODO column
    const addTaskButtons = await page.locator('button:has-text("Add Task")').all();
    if (addTaskButtons.length > 0) {
      await addTaskButtons[0].click();
      await page.waitForTimeout(1000);

      // Take screenshot of modal
      await page.screenshot({
        path: '/tmp/qa-modal-open.png',
        fullPage: true
      });
      console.log('Modal screenshot saved');

      // Fill in task details
      await page.fill('input[placeholder*="title"]', 'Design Homepage Mockups');
      await page.waitForTimeout(300);
      await page.fill('textarea', 'Create wireframes and high-fidelity mockups for the homepage redesign project');
      await page.waitForTimeout(300);

      // Click Add Task
      await page.click('button:has-text("Add Task")');
      await page.waitForTimeout(1500);

      // Take screenshot with one task
      await page.screenshot({
        path: '/tmp/qa-board-one-task.png',
        fullPage: true
      });
      console.log('Board with one task screenshot saved');
    }

    // Add more tasks
    const tasks = [
      { title: 'Implement User Authentication', desc: 'Add login, signup, and password reset functionality with JWT tokens' },
      { title: 'Setup PostgreSQL Database', desc: 'Configure database schema and migrations for production environment', column: 1 },
      { title: 'Write API Integration Tests', desc: 'Add comprehensive unit and integration tests for all API endpoints', column: 1 },
      { title: 'Deploy to Production', desc: 'Setup CI/CD pipeline and deploy application to production servers', column: 2 },
      { title: 'Code Review - PR #123', desc: 'Review authentication implementation and provide detailed feedback', column: 2 }
    ];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const columnIndex = task.column || 0;

      const buttons = await page.locator('button:has-text("Add Task")').all();
      if (buttons[columnIndex]) {
        await buttons[columnIndex].click();
        await page.waitForTimeout(500);
        await page.fill('input[placeholder*="title"]', task.title);
        await page.fill('textarea', task.desc);
        await page.click('button:has-text("Add Task")');
        await page.waitForTimeout(1000);
      }
    }

    // Take final screenshot with all tasks
    await page.screenshot({
      path: '/tmp/qa-board-multiple-tasks.png',
      fullPage: true
    });
    console.log('Board with multiple tasks screenshot saved');

    // Test hover effect
    const taskCards = await page.locator('article').all();
    if (taskCards.length > 0) {
      await taskCards[0].hover();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: '/tmp/qa-card-hover-effect.png',
        fullPage: true
      });
      console.log('Card hover effect screenshot saved');
    }
  });

  test('Test responsive on different sizes with tasks', async ({ page }) => {
    // First add some tasks at desktop size
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    const tasks = [
      { title: 'Design Homepage', desc: 'Create mockups', column: 0 },
      { title: 'Build API', desc: 'REST endpoints', column: 1 },
      { title: 'Testing', desc: 'Unit tests', column: 2 }
    ];

    for (const task of tasks) {
      const buttons = await page.locator('button:has-text("Add Task")').all();
      if (buttons[task.column]) {
        await buttons[task.column].click();
        await page.waitForTimeout(500);
        await page.fill('input[placeholder*="title"]', task.title);
        await page.fill('textarea', task.desc);
        await page.click('button:has-text("Add Task")');
        await page.waitForTimeout(1000);
      }
    }

    // Mobile view
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: '/tmp/qa-mobile-with-tasks.png',
      fullPage: true
    });
    console.log('Mobile view with tasks screenshot saved');

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: '/tmp/qa-tablet-with-tasks.png',
      fullPage: true
    });
    console.log('Tablet view with tasks screenshot saved');

    // Desktop view
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: '/tmp/qa-desktop-with-tasks.png',
      fullPage: true
    });
    console.log('Desktop view with tasks screenshot saved');
  });
});

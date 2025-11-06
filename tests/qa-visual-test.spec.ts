import { test, expect } from '@playwright/test';

test.describe('Kanban Board - Visual QA Test', () => {

  test('1. Clean Board - Desktop View', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/qa-01-clean-desktop.png',
      fullPage: true
    });

    console.log('Screenshot saved: /tmp/qa-01-clean-desktop.png');
  });

  test('2. Board with Multiple Tasks', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Add tasks to To Do
    await page.click('text=To Do >> .. >> button:has-text("+")');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder*="title"]', 'Design Homepage Mockups');
    await page.fill('textarea', 'Create wireframes and high-fidelity mockups for the homepage redesign');
    await page.click('button:has-text("Add Task")');
    await page.waitForTimeout(500);

    await page.click('text=To Do >> .. >> button:has-text("+")');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder*="title"]', 'Implement User Authentication');
    await page.fill('textarea', 'Add login, signup, and password reset functionality with JWT tokens');
    await page.click('button:has-text("Add Task")');
    await page.waitForTimeout(500);

    // Add tasks to In Progress
    await page.click('text=In Progress >> .. >> button:has-text("+")');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder*="title"]', 'Setup PostgreSQL Database');
    await page.fill('textarea', 'Configure database schema and migrations for production environment');
    await page.click('button:has-text("Add Task")');
    await page.waitForTimeout(500);

    await page.click('text=In Progress >> .. >> button:has-text("+")');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder*="title"]', 'Write API Integration Tests');
    await page.fill('textarea', 'Add comprehensive unit and integration tests for all API endpoints');
    await page.click('button:has-text("Add Task")');
    await page.waitForTimeout(500);

    // Add tasks to Done
    await page.click('text=Done >> .. >> button:has-text("+")');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder*="title"]', 'Deploy to Production');
    await page.fill('textarea', 'Setup CI/CD pipeline and deploy application to production servers');
    await page.click('button:has-text("Add Task")');
    await page.waitForTimeout(500);

    await page.click('text=Done >> .. >> button:has-text("+")');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder*="title"]', 'Code Review - PR #123');
    await page.fill('textarea', 'Review authentication implementation and provide feedback');
    await page.click('button:has-text("Add Task")');
    await page.waitForTimeout(1000);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/qa-02-with-tasks-desktop.png',
      fullPage: true
    });

    console.log('Screenshot saved: /tmp/qa-02-with-tasks-desktop.png');
  });

  test('3. Mobile View - 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/qa-03-mobile-375px.png',
      fullPage: true
    });

    console.log('Screenshot saved: /tmp/qa-03-mobile-375px.png');
  });

  test('4. Tablet View - 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/qa-04-tablet-768px.png',
      fullPage: true
    });

    console.log('Screenshot saved: /tmp/qa-04-tablet-768px.png');
  });

  test('5. Large Desktop - 1920px', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/qa-05-desktop-1920px.png',
      fullPage: true
    });

    console.log('Screenshot saved: /tmp/qa-05-desktop-1920px.png');
  });

  test('6. Modal Animation Test', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Open modal
    await page.click('text=To Do >> .. >> button:has-text("+")');
    await page.waitForTimeout(500);

    // Take screenshot with modal open
    await page.screenshot({
      path: '/tmp/qa-06-modal-open.png',
      fullPage: true
    });

    console.log('Screenshot saved: /tmp/qa-06-modal-open.png');
  });

  test('7. Card Hover Effect Test', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Add a task first
    await page.click('text=To Do >> .. >> button:has-text("+")');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder*="title"]', 'Hover Test Card');
    await page.fill('textarea', 'This card demonstrates the hover effect');
    await page.click('button:has-text("Add Task")');
    await page.waitForTimeout(1000);

    // Hover over the card
    await page.hover('article:has-text("Hover Test Card")');
    await page.waitForTimeout(300);

    // Take screenshot with hover state
    await page.screenshot({
      path: '/tmp/qa-07-card-hover.png',
      fullPage: true
    });

    console.log('Screenshot saved: /tmp/qa-07-card-hover.png');
  });

  test('8. Responsive - Extra Large Desktop - 2560px', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/qa-08-desktop-2560px.png',
      fullPage: true
    });

    console.log('Screenshot saved: /tmp/qa-08-desktop-2560px.png');
  });
});

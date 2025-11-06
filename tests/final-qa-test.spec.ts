import { test, expect, Page } from '@playwright/test';

test.describe('Kanban Board - Final Comprehensive QA Test', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('Visual Polish Check - Clean Board', async ({ page }) => {
    // Wait for the board to be fully loaded
    await page.waitForSelector('text=To Do', { timeout: 5000 });

    // Take screenshot of clean board
    await page.screenshot({
      path: '/tmp/kanban-clean-board.png',
      fullPage: true
    });

    // Verify basic visual elements are present
    await expect(page.locator('text=Kanban Board')).toBeVisible();
    await expect(page.locator('text=To Do')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=Done')).toBeVisible();
  });

  test('Visual Polish Check - Board with Tasks', async ({ page }) => {
    // Add multiple tasks to different columns
    const tasks = [
      { title: 'Design Homepage', description: 'Create wireframes and mockups', column: 'To Do' },
      { title: 'Implement Authentication', description: 'Add login and signup functionality', column: 'To Do' },
      { title: 'Setup Database', description: 'Configure PostgreSQL and create schema', column: 'In Progress' },
      { title: 'Write API Tests', description: 'Add unit and integration tests', column: 'In Progress' },
      { title: 'Deploy to Production', description: 'Setup CI/CD pipeline', column: 'Done' },
      { title: 'Code Review', description: 'Review PR #123', column: 'Done' }
    ];

    for (const task of tasks) {
      // Find the column and click add task button
      const columnSection = page.locator(`section:has-text("${task.column}")`).first();
      await columnSection.locator('button:has-text("+")').click();

      // Fill in task details
      await page.locator('input[placeholder*="title"]').fill(task.title);
      await page.locator('textarea[placeholder*="description"]').fill(task.description);

      // Click Add Task button
      await page.locator('button:has-text("Add Task")').click();

      // Wait for modal to close
      await page.waitForTimeout(500);
    }

    // Take screenshot with tasks
    await page.screenshot({
      path: '/tmp/kanban-with-tasks.png',
      fullPage: true
    });
  });

  test('Hover Effects - Card Hover', async ({ page }) => {
    // Add a task first
    const columnSection = page.locator('section:has-text("To Do")').first();
    await columnSection.locator('button:has-text("+")').click();
    await page.locator('input[placeholder*="title"]').fill('Test Card Hover');
    await page.locator('textarea[placeholder*="description"]').fill('Testing hover effects');
    await page.locator('button:has-text("Add Task")').click();
    await page.waitForTimeout(500);

    // Find the task card
    const taskCard = page.locator('article:has-text("Test Card Hover")').first();

    // Take screenshot before hover
    await taskCard.screenshot({
      path: '/tmp/kanban-card-before-hover.png'
    });

    // Hover over the card
    await taskCard.hover();
    await page.waitForTimeout(300);

    // Take screenshot during hover
    await taskCard.screenshot({
      path: '/tmp/kanban-card-hover.png'
    });

    // Verify hover effect by checking box-shadow or transform
    const boxShadow = await taskCard.evaluate((el) => {
      return window.getComputedStyle(el).boxShadow;
    });
    expect(boxShadow).not.toBe('none');
  });

  test('Modal Animations - Open and Close', async ({ page }) => {
    // Open modal
    const addButton = page.locator('section:has-text("To Do")').first().locator('button:has-text("+")');
    await addButton.click();

    // Wait for modal to appear
    await page.waitForSelector('div[role="dialog"]', { state: 'visible' });

    // Take screenshot of open modal
    await page.screenshot({
      path: '/tmp/kanban-modal-open.png',
      fullPage: true
    });

    // Verify modal is visible
    await expect(page.locator('text=Add New Task')).toBeVisible();

    // Close modal by clicking outside
    await page.locator('div[role="dialog"]').evaluate((el) => {
      const backdrop = el.parentElement;
      if (backdrop) backdrop.click();
    });

    // Wait for modal to close
    await page.waitForTimeout(500);

    // Verify modal is closed
    await expect(page.locator('text=Add New Task')).not.toBeVisible();
  });

  test('Responsive Design - Mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/kanban-mobile-375px.png',
      fullPage: true
    });

    // Verify columns are visible and properly sized
    const columns = page.locator('section[class*="bg-gray"]');
    const columnCount = await columns.count();
    expect(columnCount).toBeGreaterThanOrEqual(3);

    // Check that columns stack or scroll horizontally
    const firstColumn = columns.first();
    const columnWidth = await firstColumn.evaluate((el) => el.offsetWidth);
    expect(columnWidth).toBeLessThanOrEqual(375);
  });

  test('Responsive Design - Tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/kanban-tablet-768px.png',
      fullPage: true
    });

    // Verify layout
    const columns = page.locator('section[class*="bg-gray"]');
    const columnCount = await columns.count();
    expect(columnCount).toBeGreaterThanOrEqual(3);
  });

  test('Responsive Design - Desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/kanban-desktop-1920px.png',
      fullPage: true
    });

    // Verify columns are visible side by side
    const columns = page.locator('section[class*="bg-gray"]');
    const columnCount = await columns.count();
    expect(columnCount).toBeGreaterThanOrEqual(3);

    // All columns should be visible in viewport
    const boardWidth = await page.locator('main').evaluate((el) => el.scrollWidth);
    expect(boardWidth).toBeLessThanOrEqual(1920);
  });

  test('Responsive Design - Large Desktop (2560px)', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({
      path: '/tmp/kanban-desktop-2560px.png',
      fullPage: true
    });
  });

  test('Animation Performance - Task Addition', async ({ page }) => {
    // Add a task and measure animation
    const startTime = Date.now();

    const columnSection = page.locator('section:has-text("To Do")').first();
    await columnSection.locator('button:has-text("+")').click();
    await page.locator('input[placeholder*="title"]').fill('Animation Test Task');
    await page.locator('textarea[placeholder*="description"]').fill('Testing fade in animation');
    await page.locator('button:has-text("Add Task")').click();

    // Wait for task to appear
    await page.waitForSelector('article:has-text("Animation Test Task")');

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within reasonable time (< 2 seconds)
    expect(duration).toBeLessThan(2000);
  });

  test('Drag and Drop Animation', async ({ page }) => {
    // Add a task to drag
    const columnSection = page.locator('section:has-text("To Do")').first();
    await columnSection.locator('button:has-text("+")').click();
    await page.locator('input[placeholder*="title"]').fill('Drag Test Task');
    await page.locator('textarea[placeholder*="description"]').fill('Testing drag animation');
    await page.locator('button:has-text("Add Task")').click();
    await page.waitForTimeout(500);

    // Find the task card
    const taskCard = page.locator('article:has-text("Drag Test Task")').first();
    const inProgressColumn = page.locator('section:has-text("In Progress")').first();

    // Get initial positions
    const taskBox = await taskCard.boundingBox();
    const columnBox = await inProgressColumn.boundingBox();

    if (taskBox && columnBox) {
      // Perform drag operation
      await taskCard.hover();
      await page.mouse.down();

      // Move to In Progress column
      await page.mouse.move(columnBox.x + columnBox.width / 2, columnBox.y + columnBox.height / 2, { steps: 10 });

      // Take screenshot during drag
      await page.screenshot({
        path: '/tmp/kanban-drag-animation.png',
        fullPage: true
      });

      await page.mouse.up();
      await page.waitForTimeout(500);

      // Verify task moved to new column
      const taskInNewColumn = inProgressColumn.locator('article:has-text("Drag Test Task")');
      await expect(taskInNewColumn).toBeVisible();
    }
  });

  test('Overall Page Performance', async ({ page }) => {
    // Measure page load time
    const navigationTiming = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        loadComplete: perfData.loadEventEnd - perfData.fetchStart,
        domInteractive: perfData.domInteractive - perfData.fetchStart
      };
    });

    console.log('Performance Metrics:', navigationTiming);

    // Verify performance is acceptable
    expect(navigationTiming.domContentLoaded).toBeLessThan(3000); // < 3 seconds
    expect(navigationTiming.loadComplete).toBeLessThan(5000); // < 5 seconds
  });

  test('Accessibility Check', async ({ page }) => {
    // Check for proper heading structure
    const h1 = await page.locator('h1').count();
    expect(h1).toBeGreaterThanOrEqual(1);

    // Check for proper button labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      // Either text or aria-label should be present
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('User Experience Flow - Complete Task Journey', async ({ page }) => {
    // Complete user journey: Create task -> Move to In Progress -> Move to Done

    // 1. Create task in To Do
    const toDoColumn = page.locator('section:has-text("To Do")').first();
    await toDoColumn.locator('button:has-text("+")').click();
    await page.locator('input[placeholder*="title"]').fill('Complete User Journey');
    await page.locator('textarea[placeholder*="description"]').fill('Testing complete workflow');
    await page.locator('button:has-text("Add Task")').click();
    await page.waitForTimeout(500);

    // 2. Verify task is in To Do
    await expect(toDoColumn.locator('article:has-text("Complete User Journey")')).toBeVisible();

    // 3. Move to In Progress
    const task = page.locator('article:has-text("Complete User Journey")').first();
    const inProgressColumn = page.locator('section:has-text("In Progress")').first();

    const taskBox = await task.boundingBox();
    const inProgressBox = await inProgressColumn.boundingBox();

    if (taskBox && inProgressBox) {
      await task.hover();
      await page.mouse.down();
      await page.mouse.move(inProgressBox.x + inProgressBox.width / 2, inProgressBox.y + inProgressBox.height / 2, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(500);
    }

    // 4. Verify task is in In Progress
    await expect(inProgressColumn.locator('article:has-text("Complete User Journey")')).toBeVisible();

    // 5. Move to Done
    const doneColumn = page.locator('section:has-text("Done")').first();
    const taskInProgress = page.locator('article:has-text("Complete User Journey")').first();
    const doneBox = await doneColumn.boundingBox();
    const taskInProgressBox = await taskInProgress.boundingBox();

    if (taskInProgressBox && doneBox) {
      await taskInProgress.hover();
      await page.mouse.down();
      await page.mouse.move(doneBox.x + doneBox.width / 2, doneBox.y + doneBox.height / 2, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(500);
    }

    // 6. Verify task is in Done
    await expect(doneColumn.locator('article:has-text("Complete User Journey")')).toBeVisible();

    // Take final screenshot
    await page.screenshot({
      path: '/tmp/kanban-complete-journey.png',
      fullPage: true
    });
  });
});

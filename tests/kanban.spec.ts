import { test, expect, Page } from '@playwright/test';

test.describe('Kanban Board QA Testing', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  test('1. Visual Inspection - Initial Board Layout', async () => {
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Allow animations to settle

    // Take screenshot of initial board
    await page.screenshot({
      path: '/Users/steve/code/mygit/kanban/screenshots/01-initial-board.png',
      fullPage: true
    });

    // Verify three default columns are visible
    const todoColumn = page.locator('text=TODO').first();
    const inProgressColumn = page.locator('text=In Progress').first();
    const completedColumn = page.locator('text=Completed').first();

    await expect(todoColumn).toBeVisible();
    await expect(inProgressColumn).toBeVisible();
    await expect(completedColumn).toBeVisible();

    // Verify Add Column button is visible
    const addColumnButton = page.locator('button:has-text("Add Column")');
    await expect(addColumnButton).toBeVisible();

    // Check for Add Task buttons in each column
    const addTaskButtons = page.locator('button:has-text("Add Task")');
    const count = await addTaskButtons.count();
    expect(count).toBeGreaterThanOrEqual(3); // At least 3 columns should have Add Task buttons
  });

  test('2. Modal Visual Inspection - Add Task Modal', async () => {
    // Click the Add Task button in TODO column
    const addTaskButtons = page.locator('button:has-text("Add Task")');
    await addTaskButtons.first().click();

    // Wait for modal to appear with animation
    await page.waitForTimeout(500);

    // Take screenshot of the modal
    await page.screenshot({
      path: '/Users/steve/code/mygit/kanban/screenshots/02-add-task-modal.png',
      fullPage: true
    });

    // Verify modal is visible and has proper styling
    const modal = page.locator('[role="dialog"]').or(page.locator('.modal')).or(page.locator('form'));
    await expect(modal.first()).toBeVisible();

    // Verify form fields exist
    const titleInput = page.locator('input[name="title"]').or(page.locator('input[placeholder*="title" i]'));
    const descriptionInput = page.locator('textarea[name="description"]').or(page.locator('textarea[placeholder*="description" i]'));

    await expect(titleInput.first()).toBeVisible();
    await expect(descriptionInput.first()).toBeVisible();

    // Cancel the modal
    const cancelButton = page.locator('button:has-text("Cancel")');
    await cancelButton.click();
    await page.waitForTimeout(500); // Wait for modal close animation
  });

  test('3. Functional Testing - Add Tasks to Columns', async () => {
    // Add first task to TODO column
    const addTaskButtons = page.locator('button:has-text("Add Task")');
    await addTaskButtons.first().click();
    await page.waitForTimeout(300);

    // Fill in task details
    const titleInput = page.locator('input[name="title"]').or(page.locator('input[placeholder*="title" i]'));
    const descriptionInput = page.locator('textarea[name="description"]').or(page.locator('textarea[placeholder*="description" i]'));

    await titleInput.first().fill('Test Task 1');
    await descriptionInput.first().fill('This is a test task to verify the kanban board functionality');

    // Submit the form
    const submitButton = page.locator('button:has-text("Add Task")').last();
    await submitButton.click();
    await page.waitForTimeout(500);

    // Verify task appears
    await expect(page.locator('text=Test Task 1')).toBeVisible();

    // Add second task to TODO column
    await addTaskButtons.first().click();
    await page.waitForTimeout(300);

    await titleInput.first().fill('Test Task 2');
    await descriptionInput.first().fill('Another test task for the TODO column');
    await submitButton.click();
    await page.waitForTimeout(500);

    // Add third task to In Progress column
    await addTaskButtons.nth(1).click();
    await page.waitForTimeout(300);

    await titleInput.first().fill('Test Task 3');
    await descriptionInput.first().fill('This task goes directly to In Progress');
    await submitButton.click();
    await page.waitForTimeout(500);

    // Add fourth task to Completed column
    await addTaskButtons.nth(2).click();
    await page.waitForTimeout(300);

    await titleInput.first().fill('Test Task 4');
    await descriptionInput.first().fill('This task is already completed');
    await submitButton.click();
    await page.waitForTimeout(500);

    // Take screenshot showing multiple tasks
    await page.screenshot({
      path: '/Users/steve/code/mygit/kanban/screenshots/03-multiple-tasks.png',
      fullPage: true
    });

    // Verify all tasks are visible
    await expect(page.locator('text=Test Task 1')).toBeVisible();
    await expect(page.locator('text=Test Task 2')).toBeVisible();
    await expect(page.locator('text=Test Task 3')).toBeVisible();
    await expect(page.locator('text=Test Task 4')).toBeVisible();
  });

  test('4. Drag and Drop Testing', async () => {
    // Wait for any animations to complete
    await page.waitForTimeout(1000);

    // Find the first task in TODO column
    const task1 = page.locator('text=Test Task 1').first();
    await expect(task1).toBeVisible();

    // Find the task element container (usually parent of the text)
    const taskElement = task1.locator('..').locator('..');

    // Find the In Progress column drop zone
    const inProgressColumn = page.locator('text=In Progress').first().locator('..').locator('..');

    // Get bounding boxes for drag and drop
    const taskBox = await taskElement.boundingBox();
    const columnBox = await inProgressColumn.boundingBox();

    if (taskBox && columnBox) {
      // Perform drag and drop
      await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(200);

      // Move to target column
      await page.mouse.move(columnBox.x + columnBox.width / 2, columnBox.y + columnBox.height / 2, { steps: 10 });
      await page.waitForTimeout(200);

      await page.mouse.up();
      await page.waitForTimeout(1000); // Wait for animations
    }

    // Take screenshot after first drag
    await page.screenshot({
      path: '/Users/steve/code/mygit/kanban/screenshots/04-after-drag-1.png',
      fullPage: true
    });

    // Try dragging Task 2 to Completed column
    const task2 = page.locator('text=Test Task 2').first();
    if (await task2.isVisible()) {
      const task2Element = task2.locator('..').locator('..');
      const completedColumn = page.locator('text=Completed').first().locator('..').locator('..');

      const task2Box = await task2Element.boundingBox();
      const completedBox = await completedColumn.boundingBox();

      if (task2Box && completedBox) {
        await page.mouse.move(task2Box.x + task2Box.width / 2, task2Box.y + task2Box.height / 2);
        await page.mouse.down();
        await page.waitForTimeout(200);

        await page.mouse.move(completedBox.x + completedBox.width / 2, completedBox.y + completedBox.height / 2, { steps: 10 });
        await page.waitForTimeout(200);

        await page.mouse.up();
        await page.waitForTimeout(1000);
      }
    }

    // Take final screenshot showing moved tasks
    await page.screenshot({
      path: '/Users/steve/code/mygit/kanban/screenshots/05-after-drag-2.png',
      fullPage: true
    });
  });

  test('5. Task Edit Functionality', async () => {
    await page.waitForTimeout(500);

    // Look for edit buttons (pencil icon)
    const editButtons = page.locator('button[aria-label*="edit" i]')
      .or(page.locator('button:has(svg)'))
      .or(page.locator('[class*="edit"]'));

    // Try to find and click an edit button
    const firstEditButton = editButtons.first();

    if (await firstEditButton.isVisible()) {
      await firstEditButton.click();
      await page.waitForTimeout(500);

      // Take screenshot of edit modal
      await page.screenshot({
        path: '/Users/steve/code/mygit/kanban/screenshots/06-edit-modal.png',
        fullPage: true
      });

      // Verify form is pre-populated
      const titleInput = page.locator('input[name="title"]').or(page.locator('input[placeholder*="title" i]'));
      const descriptionInput = page.locator('textarea[name="description"]').or(page.locator('textarea[placeholder*="description" i]'));

      const titleValue = await titleInput.first().inputValue();
      expect(titleValue.length).toBeGreaterThan(0);

      // Update the task
      await titleInput.first().fill('Updated Test Task');
      await descriptionInput.first().fill('This task has been updated through the edit functionality');

      // Save the changes
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button:has-text("Update")'));
      await saveButton.click();
      await page.waitForTimeout(500);

      // Verify the updated task is visible
      await expect(page.locator('text=Updated Test Task')).toBeVisible();

      // Take screenshot showing updated task
      await page.screenshot({
        path: '/Users/steve/code/mygit/kanban/screenshots/07-after-edit.png',
        fullPage: true
      });
    }
  });

  test('6. Final Board State', async () => {
    // Take a final screenshot of the complete board
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: '/Users/steve/code/mygit/kanban/screenshots/08-final-state.png',
      fullPage: true
    });
  });

  test.afterAll(async () => {
    await page.close();
  });
});

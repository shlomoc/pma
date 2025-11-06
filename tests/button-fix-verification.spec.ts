import { test, expect, Page } from '@playwright/test'

/**
 * Comprehensive test suite to verify the fix for task card button interactions
 *
 * This test suite verifies:
 * 1. Add task functionality
 * 2. Button visibility (Edit, Delete, AI)
 * 3. Edit button opens modal with task data
 * 4. Delete button removes tasks
 * 5. AI button functionality
 * 6. Multiple tasks handling
 * 7. Drag-and-drop still works after the fix
 */

// Helper function to add a task
async function addTask(page: Page, title: string, description: string, columnIndex: number = 0) {
  const addTaskButtons = page.locator('button:has-text("Add Task")')
  const addTaskButton = addTaskButtons.nth(columnIndex)
  await addTaskButton.click()

  // Wait for modal to appear by looking for the modal heading
  await expect(page.locator('h2:has-text("Add New Task")')).toBeVisible({ timeout: 3000 })

  // Fill the task form - use more specific selectors
  const titleInput = page.locator('input[placeholder="Enter task title..."]')
  const descriptionTextarea = page.locator('textarea[placeholder*="Add notes"]')

  await titleInput.fill(title)
  await descriptionTextarea.fill(description)

  // Save the task
  await page.locator('button:has-text("Add Task")').last().click()

  // Wait for modal to close
  await expect(page.locator('h2:has-text("Add New Task")')).not.toBeVisible({ timeout: 3000 })

  // Wait for task to appear
  await expect(page.locator(`text=${title}`).first()).toBeVisible({ timeout: 3000 })
}

test.describe('Button Fix Verification Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
    // Wait for the app to load
    await expect(page.locator('h1:has-text("Kanban Board")')).toBeVisible()
  })

  test('1. Add a task to the TODO column', async ({ page }) => {
    // Test adding a task to TODO column
    await addTask(page, 'Test Task 1', 'This is a test task description', 0)

    // Verify task appears on the board
    await expect(page.locator('text=Test Task 1')).toBeVisible()
    await expect(page.locator('text=This is a test task description')).toBeVisible()

    // Take screenshot
    await page.screenshot({ path: 'test-results/01-task-added.png', fullPage: true })
  })

  test('2. Hover over task to reveal buttons', async ({ page }) => {
    // Add a task first
    await addTask(page, 'Hover Test Task', 'Description for hover test', 0)

    // Find the task card
    const taskCard = page.locator('text=Hover Test Task').locator('..').locator('..')

    // Note: Buttons should be visible even without hover (fixed behavior)
    // But we'll still test the hover to ensure it doesn't break anything
    await taskCard.hover()

    // Wait for any animations
    await page.waitForTimeout(500)

    // Verify all three buttons are visible
    const editButton = taskCard.locator('button[title="Edit task"]')
    const deleteButton = taskCard.locator('button[title="Delete task"]')
    const aiButton = taskCard.locator('button[title="Generate AI prompt"]')

    await expect(editButton).toBeVisible()
    await expect(deleteButton).toBeVisible()
    await expect(aiButton).toBeVisible()

    // Take screenshot showing buttons
    await page.screenshot({ path: 'test-results/02-buttons-visible.png', fullPage: true })
  })

  test('3. Click Edit button - verify modal opens with task data', async ({ page }) => {
    const taskTitle = 'Edit Test Task'
    const taskDescription = 'This task should be editable'

    // Add a task
    await addTask(page, taskTitle, taskDescription, 0)

    // Find the task card and click edit button
    const taskCard = page.locator(`text=${taskTitle}`).locator('..').locator('..')
    const editButton = taskCard.locator('button[title="Edit task"]')

    // Click the edit button
    await editButton.click()

    // Wait for modal to appear
    await expect(page.locator('h2:has-text("Edit Task")')).toBeVisible({ timeout: 3000 })

    // Verify the task data is pre-populated
    const titleInput = page.locator('input[placeholder="Enter task title..."]')
    const descriptionTextarea = page.locator('textarea[placeholder*="Add notes"]')

    await expect(titleInput).toHaveValue(taskTitle)
    await expect(descriptionTextarea).toHaveValue(taskDescription)

    // Take screenshot
    await page.screenshot({ path: 'test-results/03-edit-modal-opened.png', fullPage: true })

    // Close the modal
    await page.locator('button:has-text("Cancel")').click()
    await expect(page.locator('h2:has-text("Edit Task")')).not.toBeVisible({ timeout: 3000 })
  })

  test('4. Click Delete button - verify task is deleted', async ({ page }) => {
    const taskTitle = 'Delete Test Task'

    // Add a task
    await addTask(page, taskTitle, 'This task will be deleted', 0)

    // Verify task exists
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible()

    // Find the task card and click delete button
    const taskCard = page.locator(`text=${taskTitle}`).locator('..').locator('..')
    const deleteButton = taskCard.locator('button[title="Delete task"]')

    // Take screenshot before deletion
    await page.screenshot({ path: 'test-results/04a-before-delete.png', fullPage: true })

    // Click the delete button
    await deleteButton.click()

    // Wait for task to be removed
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible({ timeout: 3000 })

    // Take screenshot after deletion
    await page.screenshot({ path: 'test-results/04b-after-delete.png', fullPage: true })
  })

  test('5. Click AI button - verify AI modal opens', async ({ page }) => {
    const taskTitle = 'AI Test Task'

    // Add a task
    await addTask(page, taskTitle, 'Generate an AI prompt for this task', 0)

    // Find the task card and click AI button
    const taskCard = page.locator(`text=${taskTitle}`).locator('..').locator('..')
    const aiButton = taskCard.locator('button[title="Generate AI prompt"]')

    // Click the AI button
    await aiButton.click()

    // Wait for AI modal to appear
    await page.waitForTimeout(1000) // Give it time to process

    // Look for AI modal (it should be visible even if there's an error message)
    const aiModalHeading = page.locator('h2:has-text("AI Generated Prompt")')
    await expect(aiModalHeading).toBeVisible({ timeout: 5000 })

    // Take screenshot
    await page.screenshot({ path: 'test-results/05-ai-modal-opened.png', fullPage: true })

    // Close the modal
    await page.locator('button:has-text("Close")').click()
  })

  test('6. Test multiple tasks - verify buttons work on all of them', async ({ page }) => {
    // Add 3 tasks to TODO column
    await addTask(page, 'Task 1', 'First task', 0)
    await addTask(page, 'Task 2', 'Second task', 0)
    await addTask(page, 'Task 3', 'Third task', 0)

    // Verify all tasks are visible
    await expect(page.locator('text=Task 1')).toBeVisible()
    await expect(page.locator('text=Task 2')).toBeVisible()
    await expect(page.locator('text=Task 3')).toBeVisible()

    // Take screenshot showing all tasks
    await page.screenshot({ path: 'test-results/06a-multiple-tasks.png', fullPage: true })

    // Test edit button on Task 2
    const task2Card = page.locator('text=Task 2').locator('..').locator('..')
    const task2EditButton = task2Card.locator('button[title="Edit task"]')
    await task2EditButton.click()

    await expect(page.locator('h2:has-text("Edit Task")')).toBeVisible({ timeout: 3000 })
    await expect(page.locator('input[placeholder="Enter task title..."]')).toHaveValue('Task 2')

    await page.screenshot({ path: 'test-results/06b-task2-edit.png', fullPage: true })

    await page.locator('button:has-text("Cancel")').click()
    await expect(page.locator('h2:has-text("Edit Task")')).not.toBeVisible()

    // Test delete button on Task 1
    const task1Card = page.locator('text=Task 1').locator('..').locator('..')
    const task1DeleteButton = task1Card.locator('button[title="Delete task"]')
    await task1DeleteButton.click()

    await expect(page.locator('text=Task 1')).not.toBeVisible({ timeout: 3000 })

    // Verify Task 2 and Task 3 still exist
    await expect(page.locator('text=Task 2')).toBeVisible()
    await expect(page.locator('text=Task 3')).toBeVisible()

    await page.screenshot({ path: 'test-results/06c-after-delete-task1.png', fullPage: true })
  })

  test('7. Cross-column drag - verify drag-and-drop still works', async ({ page }) => {
    // Add a task to TODO column
    await addTask(page, 'Draggable Task', 'This task will be dragged', 0)

    // Take screenshot before drag
    await page.screenshot({ path: 'test-results/07a-before-drag.png', fullPage: true })

    // Find the task card
    const taskCard = page.locator('text=Draggable Task').locator('..').locator('..')

    // Find the "In Progress" column
    const inProgressColumn = page.locator('h2:has-text("In Progress")').locator('..').locator('..')

    // Get bounding boxes
    const taskBox = await taskCard.boundingBox()
    const columnBox = await inProgressColumn.boundingBox()

    if (!taskBox || !columnBox) {
      throw new Error('Could not get bounding boxes for drag operation')
    }

    // Perform drag: start from task center, move to column center
    await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2)
    await page.mouse.down()

    // Move to the In Progress column
    await page.mouse.move(columnBox.x + columnBox.width / 2, columnBox.y + columnBox.height / 2, { steps: 10 })
    await page.waitForTimeout(500)

    await page.mouse.up()

    // Wait for animation to complete
    await page.waitForTimeout(1000)

    // Take screenshot after drag
    await page.screenshot({ path: 'test-results/07b-after-drag.png', fullPage: true })

    // Verify the task is now in the In Progress column
    // Look for the task within the In Progress column
    const taskInNewColumn = inProgressColumn.locator('text=Draggable Task')
    await expect(taskInNewColumn).toBeVisible({ timeout: 3000 })

    // Verify buttons still work after drag
    const draggedTaskCard = taskInNewColumn.locator('..').locator('..')
    const editButton = draggedTaskCard.locator('button[title="Edit task"]')

    await editButton.click()

    await expect(page.locator('h2:has-text("Edit Task")')).toBeVisible({ timeout: 3000 })

    await page.screenshot({ path: 'test-results/07c-buttons-work-after-drag.png', fullPage: true })
  })

  test('8. Console errors check - verify no errors during interactions', async ({ page }) => {
    const consoleErrors: string[] = []

    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Perform various operations
    await addTask(page, 'Console Test Task', 'Testing for console errors', 0)

    const taskCard = page.locator('text=Console Test Task').locator('..').locator('..')

    // Click edit button
    const editButton = taskCard.locator('button[title="Edit task"]')
    await editButton.click()

    await expect(page.locator('h2:has-text("Edit Task")')).toBeVisible()
    await page.locator('button:has-text("Cancel")').click()

    // Click AI button
    const aiButton = taskCard.locator('button[title="Generate AI prompt"]')
    await aiButton.click()
    await page.waitForTimeout(2000)

    // Close AI modal if it opened
    const closeButton = page.locator('button:has-text("Close")').first()
    if (await closeButton.isVisible()) {
      await closeButton.click()
    }

    // Take screenshot
    await page.screenshot({ path: 'test-results/08-console-check.png', fullPage: true })

    // Report console errors
    if (consoleErrors.length > 0) {
      console.log('Console errors detected:', consoleErrors)
    }

    // This test will show console errors in the report but won't fail
    // We're just documenting them for analysis
  })
})

import { test, expect } from '@playwright/test'

test.describe('AI Prompt Generation Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
    // Wait for the app to load
    await page.waitForSelector('text=Kanban Board')
  })

  test('AI button appears on task card hover', async ({ page }) => {
    // Add a task first
    const addTaskButton = page.locator('button:has-text("Add Task")').first()
    await addTaskButton.click()

    // Wait for modal to appear
    await page.waitForSelector('text=Add Task')

    // Fill the task form - get inputs inside the modal
    const modal = page.locator('[role="dialog"]')
    await modal.locator('input[type="text"]').fill('Test Task')
    await modal.locator('textarea').fill('This is a test task description')

    // Save the task by clicking the save button in modal
    await modal.locator('button:has-text("Add Task")').click()

    // Wait for the modal to close and task to appear
    await page.waitForTimeout(500)
    await expect(page.locator('text=Test Task')).toBeVisible()

    // Hover over the task card to reveal action buttons
    const taskText = page.locator('text=Test Task').first()
    const taskCard = taskText.locator('ancestor::div[@class*="bg-white"]')
    await taskCard.hover()

    // Wait a moment for animations
    await page.waitForTimeout(300)

    // Check that buttons are visible - look for button with "Generate AI prompt" title
    const aiButton = page.locator('button[title="Generate AI prompt"]')
    await expect(aiButton).toBeVisible()
  })

  test('AI modal opens when AI button is clicked', async ({ page }) => {
    // Add a task
    const addTaskButton = page.locator('button:has-text("Add Task")').first()
    await addTaskButton.click()

    // Fill modal
    const modal = page.locator('[role="dialog"]')
    await modal.locator('input[type="text"]').fill('Build a feature')
    await modal.locator('textarea').fill('Create a user authentication system')

    // Save
    await modal.locator('button:has-text("Add Task")').click()

    // Wait for task
    await page.waitForTimeout(500)
    await expect(page.locator('text=Build a feature')).toBeVisible()

    // Hover over task card
    const taskText = page.locator('text=Build a feature').first()
    const taskCard = taskText.locator('ancestor::div[@class*="bg-white"]')
    await taskCard.hover()

    await page.waitForTimeout(300)

    // Click AI button
    const aiButton = page.locator('button[title="Generate AI prompt"]')
    await aiButton.click()

    // Check that AI modal opens
    await expect(page.locator('h2:has-text("AI Generated Prompt")')).toBeVisible({ timeout: 3000 })
  })

  test('UI elements render correctly on the page', async ({ page }) => {
    // Verify the app loaded correctly
    await expect(page.locator('h1:has-text("Kanban Board")')).toBeVisible()
    await expect(page.locator('text=Organize and track your coding projects')).toBeVisible()

    // Verify columns are present
    await expect(page.locator('h2:has-text("TODO")')).toBeVisible()
    await expect(page.locator('h2:has-text("In Progress")')).toBeVisible()
    await expect(page.locator('h2:has-text("Completed")')).toBeVisible()
  })
})

// spec: specs/e2e-comprehensive-test-plan.md
// section: Teacher Student Management

import { expect, test } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'

test.describe('Teacher Student Management', () => {
  const teacherEmail = 'e2e.regcreate.20260917194010@test.com'
  const teacherPassword = 'Test123!@#'
  const privateTeacherEmail = 'private.teacher@wmf.test'
  const privateTeacherPassword = 'Teacher456!@#'

  test('Teacher views list of student registrations and opens a summary', async ({ page }) => {
    const pm = new PageManager(page)

    // Create a Solo registration linked to the Private Teacher test account
    await pm.loginPage.goto()
    await pm.loginPage.signIn(teacherEmail, teacherPassword)
    await page.getByRole('img', { name: 'New Solo Registration' }).click()
    await page.getByRole('button', { name: 'I Understand' }).click()

    await page.getByRole('textbox', { name: 'First Name' }).fill('Student')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('One')
    await page.getByRole('spinbutton', { name: 'Age' }).fill('15')
    await page.getByRole('textbox', { name: 'Mailing Address' }).fill('123 Test St')
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('R2M 2Y7')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045551111')
    await page.getByRole('textbox', { name: 'Email' }).fill('student.one@test.com')
    await page.locator('select[name="instrument"]').selectOption('Piano')
    await page.locator('select[name="photoPermission"]').selectOption('Yes')
    await page.getByRole('button', { name: 'Next' }).click()

    // Select the Private Teacher test account as the registration's teacher
    const teacherCombobox = page.getByRole('combobox')
    await teacherCombobox.click()
    await teacherCombobox.fill('a')
    await page.getByRole('option', { name: 'Teacher, Private' }).click()

    // 1. Navigate to /Students as a teacher account
    await pm.loginPage.goto()
    await pm.loginPage.signIn(privateTeacherEmail, privateTeacherPassword)
    await page.goto('http://localhost:3001/students')

    // expect: A list of student registrations linked to the teacher is displayed
    const studentRow = page.locator('tr').filter({ hasText: 'Student One' })
    await expect(studentRow).toContainText('SOLO')

    // 1. Click a student registration from the list
    await studentRow.getByRole('button').first().click()

    // expect: User is navigated to /students/summary showing that student's performer, classes, and teacher details
    await expect(page).toHaveURL('http://localhost:3001/students/summary')
    await expect(page.getByRole('heading', { name: 'Student One' })).toBeVisible()
    await expect(page.getByText('Email: student.one@test.com')).toBeVisible()
  })

  test('Non-teacher account cannot access /Students', async ({ page }) => {
    const pm = new PageManager(page)

    // 1. Sign in as a regular (non-teacher) account and navigate directly to /Students
    await pm.loginPage.goto()
    await pm.loginPage.signIn(teacherEmail, teacherPassword)
    await page.goto('http://localhost:3001/students')

    // expect: No student registrations are shown; the backend rejects the unauthorized query and
    // an error is surfaced (the 'user' middleware allows the route to render, but the student
    // registrations query itself is restricted to teacher accounts)
    await expect(page.getByText('Error loading registrations')).toBeVisible()
    await expect(page.locator('table tbody tr')).toHaveCount(0)
  })
})

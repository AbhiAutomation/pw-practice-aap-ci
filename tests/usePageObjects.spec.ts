import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManger'


test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200/')
})

test('navigate to form page', async ({ page }) => {
  const pm = new PageManager(page)
 
  // await pm.navigateTo(new NavigationPage(page)).formLayoutsPage()
  // Above code shpw dependency injection at function level
  await pm.navigateTo().formLayoutsPage()
  await pm.navigateTo().datepickerPage()
  await pm.navigateTo().smartTablePage()
  await pm.navigateTo().toastrPage()
  await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async ({ page }) => {
  const pm = new PageManager(page)
  
  await pm.navigateTo().formLayoutsPage()
  await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(
    'test@test.com',
    'Welcome1',
    'Option 2'
  )

  await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(
    'John Smith',
    'John@test.com',
    false
  )
  await pm.navigateTo().datepickerPage()
  await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(5, 10)
  await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(5, 15)
})

import {test, expect} from '@playwright/test'
import { timeout } from 'rxjs/operators';
test.beforeEach(async({page},testinfo)=>{
 await page.goto('http://uitestingplayground.com/ajax');
  await page.getByText('Button Triggering AJAX Request').click();
  testinfo.setTimeout(testinfo.timeout +20000) // adding the time for each test execution 
})
test('Verify the content in the page',async({page})=>{
  const sucessButton =  page.locator('.bg-success')
 //  sucessButton.click()

//   const text = await page.locator('.bg-success').allTextContents();
//   expect(text).toContain('Data loaded with AJAX get request.');

expect(sucessButton).toHaveText('Data loaded with AJAX get request.',{timeout: 20000})
})

test('timeouts',async({page})=>{
 //   test.setTimeout(10000)
 test.slow() //multiplay 3 times the time out
  const sucessButton =  page.locator('.bg-success')
  await  sucessButton.click()

})
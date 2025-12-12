import { expect, test } from "@playwright/test";

test.describe("test suite 1", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iot-dashboard");
    await page.getByRole("link", { name: "Forms" }).click();
    console.log("beforeEach hook Suite Forms");
  });

  test("navigate Forms and click the radio button ", async ({ page }) => {
    await page.getByRole("link", { name: "Form Layouts" }).click();
    const usingtheGridForm= page.locator('nb-card',{hasText:"Using the Grid"});
    await usingtheGridForm.getByRole("radio", { name: "Option 2" }).check({ force: true });
    const radiStatus = await usingtheGridForm.getByRole("radio", { name: "Option 1" }).isChecked();
    console.log("radiStatus", radiStatus);
   // expect(radiStatus).toBeTruthy();
    
    await expect(usingtheGridForm).toHaveScreenshot({maxDiffPixels:50});
  });

  test("navigate datePicker", async ({ page }) => {
    await page.getByRole("link", { name: "Datepicker" }).click();
  });
});

test.describe("test suite Table and Date ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pages/iot-dashboard");
    await page.getByRole("link", { name: "Tables & Data" }).click();
    console.log("beforeEach hook Suite Table");
  });

  test("navigate Smart Table", async ({ page }) => {
    await page.getByRole("link", { name: "Smart Table" }).click();
  });
  test("navigate Tree Grid", async ({ page }) => {
    await page.getByRole("link", { name: "Tree Grid" }).click();
  });
});

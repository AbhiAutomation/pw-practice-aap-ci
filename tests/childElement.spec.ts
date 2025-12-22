import { test, expect } from "@playwright/test";


test.describe("test suite Table and Date ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("iot-dashboard");
    await page.getByRole("link", { name: "Forms" }).click();
    await page.getByRole("link", { name: "Form Layouts" }).click();
    console.log("beforeEach hook Suite Table");
  });

  test("User facing locators ", async ({ page }) => {
    //  await page.getByRole('textbox',{name:"Email"}).click();

    await page.getByText("Using the Grid").click();
    //  await page.getByLabel('Email').first().click();

    // await page.getByPlaceholder("Jane Doe").click();
    await page.getByTestId("signin").click(); // is datatest id by playwriight
    await page.getByTitle("IoT Dashboard").click();
  });

  test("Locationg child element  facing locators ", async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click(); // using space by child element
    await page
      .locator("nb-card")
      .locator("nb-radio")
      .locator(':text-is("Option 2")')
      .click();
    await page
      .locator("nb-card")
      .getByRole("button", { name: "Sign in" })
      .first()
      .click();
    //  can use comination using normal locator  and user facing locator

    await page.locator("nb-card").nth(3).getByRole("button").click(); // Index starts with 0
  });

  test("Locationg Parent web  element  facing locators ", async ({ page }) => {
    await page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" })
      .click();
    await page
      .locator("nb-card", { has: page.locator("#inputEmail1") })
      .getByRole("textbox", { name: "Email" })
      .click();

    await page
      .locator("nb-card")
      .filter({ hasText: "Basic form" })
      .getByRole("textbox", { name: "Email" })
      .click();
    await page
      .locator("nb-card")
      .filter({ has: page.locator(".status-danger") })
      .getByRole("textbox", { name: "Password" })
      .click();
    //                                  filter then by check boxes page.lo
    await page
      .locator("nb-card")
      .filter({ has: page.locator("nb-checkbox") })
      .filter({ hasText: "Sign in" })
      .getByRole("textbox", { name: "Email" })
      .click();
    //below one level up for using x-path via two dots in locator  for paenret
    await page
      .locator(':text-is("Using the Grid")')
      .locator("..")
      .getByRole("textbox", { name: "Email" })
      .click();
  });

  test("re using locator locators ", async ({ page }) => {
    const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
    const emailField = basicForm.getByRole("textbox", { name: "Email" });
    const passwordField = basicForm.getByRole("textbox", { name: "Password" });
    await passwordField.fill("admin123");
    await emailField.fill("test@test.com");
    await basicForm.getByRole("button").click();
    await expect(emailField).toHaveValue("test@test.com");
  });

  test("Extracting value  ", async ({ page }) => {
    // single text value ;
    const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
    const buttonText = await basicForm.locator("button").textContent(); //
    expect(buttonText).toEqual("Submit");

    // All text value
    const allRadioButtonsLabels = await page
      .locator("nb-radio")
      .allTextContents();
    expect(allRadioButtonsLabels).toContain("Option 1");

    //input va;ues
    const emailField = basicForm.getByRole("textbox", { name: "Email" });
    await emailField.fill("best@bset.com");
    const emailValue = await emailField.inputValue(); // return the text of using input value function
    expect(emailValue).toEqual("best@bset.com");
    const value = await emailField.getAttribute("placeholder");
    expect(value).toEqual("Email");
  });

  test("Assertions ", async ({ page }) => {
    const basicFormButton = page
      .locator("nb-card")
      .filter({ hasText: "Basic form" })
      .locator("button");
    const text = await basicFormButton.textContent();
    expect(text).toEqual("Submit");

    //Genral Assertion
    const value = 5;
    expect(value).toEqual(5);

    // Locator Assertions  is awlwyas wait
    await expect(basicFormButton).toHaveText("Submit");

    //Soft Assertion
    await expect.soft(basicFormButton).toHaveText("Submits3");
    console.log("after soft assertion");
    await basicFormButton.click();
  });

});

import { test, expect } from "@playwright/test";
import { timeout } from "rxjs-compat/operator/timeout";

test.beforeEach(async ({ page }) => {
  await page.goto("iot-dashboard");
});

test.describe("Forms Layout Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole("link", { name: "Forms" }).click();
    await page.getByRole("link", { name: "Form Layouts" }).click();
  });

  test("Fill inline form", async ({ page }) => {
    const usingTheGridEmailInput = page
      .locator("nb-card", { hasText: "Using the Grid" })
      .getByRole("textbox", { name: "Email" });
    await usingTheGridEmailInput.fill("test@test.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("test2", { delay: 1000 }); // simulate key storkes one by one

    //generic asserion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test2");

    //locator assertion
    await expect(usingTheGridEmailInput).toHaveValue("test2");
  });

  test("Radio button assertion ", async ({ page }) => {
    const usingTheGrid = page.locator("nb-card", { hasText: "Using the Grid" });
    await usingTheGrid.getByLabel("Option 1").check({ force: true });
    await page.waitForTimeout(3000); // 3 seconds
    await usingTheGrid
      .getByRole("radio", { name: "Option 2" })
      .check({ force: true });
    await page.waitForTimeout(3000); // 3 seconds
    const radiStatus = await usingTheGrid.getByLabel("Option 2").isChecked();
    expect(radiStatus).toBeTruthy();
    //locator assertion
    expect(usingTheGrid.getByLabel("Option 2")).toBeChecked;
    expect(usingTheGrid.getByLabel("Option 1")).not.toBeChecked;
  });
});

test("checkboxws", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();
  // await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true});
  // await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).uncheck({force: true});
  // await page.getByRole('checkbox', {name: 'Show toast with icon'}).uncheck({force: true});
  const allCheckBoxes = page.getByRole("checkbox");

  for (const box of await allCheckBoxes.all()) {
    //.all create array of caheck boxes
    await box.check({ force: true });
    expect(await box.isChecked()).toBeTruthy();
  }
});
test("List tests", async ({ page }) => {
  const dropdownMenu = page.locator("ngx-header nb-select");
  await dropdownMenu.click();
  page.getByRole("list"); // get all list items if using UL(un order list )
  page.getByRole("listitem"); // get all list items if using LI(ordered list )
  const optionsList = page.locator("nb-option-list nb-option");
  expect(await optionsList.count()).toEqual(4);
  expect(optionsList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
  optionsList.filter({ hasText: "Cosmic" }).click();
  const header = page.locator("nb-layout-header");
  await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");
  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };

  await dropdownMenu.click();
  for (const color in colors) {
    await optionsList.filter({ hasText: color }).click();
    await expect(header).toHaveCSS("background-color", colors[color]);
    if (color != "Corporate") await dropdownMenu.click();
  }
});

test("tooltip", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();
  await page.getByRole("button", { name: "TOP" }).hover({ force: true });
  page.getByRole("tooltip");
  await expect(page.locator("nb-tooltip")).toHaveText("This is a tooltip");
});

test("DailogBox ", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  //Listner
  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  });

  await page
    .getByRole("table")
    .locator("tr", { hasText: "mdo@gmail.com" })
    .locator(".nb-trash")
    .click();
  await expect(page.locator("table tr").first()).not.toHaveText(
    "mdo@gmail.com"
  );
});

//  npx playwright test tests/uiComponents.spec.ts -g "HOw to get by Row"
test("HOw to get by Row  ", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();
  //   const targetRow = page.getByRole("row", { name: "fat@yandex.ru" });
  //   await targetRow.locator(".nb-edit").click();

  //   const age = page.locator("input-editor").getByPlaceholder("Age");
  //   await age.clear();
  //   await age.fill("35");
  //   page.locator(".nb-checkmark").click();
  //   expect(age).toHaveText("35");

  //to get the row based on the value in specific column
  await page.locator(".ng2-smart-pagination-nav").getByText("2").click();
  const targetRowById = page
    .getByRole("row", { name: "11" })
    .filter({ has: page.locator("td").nth(1).getByText("11") });
  await targetRowById.locator(".nb-edit").click();
  const email = page.locator("input-editor").getByPlaceholder("E-mail");
  await email.clear();
  await email.fill("test@test.com");
  await page.locator(".nb-checkmark").click();
  await expect(targetRowById.locator("td").nth(5)).toHaveText("test@test.com");

  // test filter of the table
  const ages = ["20", "30", "40", "50"];

  for (let age1 of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age1);
    await page.waitForTimeout(7000);
    const ageRows = page.locator("tbody tr");
    console.log(await ageRows.count());
    console.log("The Value ogf age" + age1);
    for (let row of await ageRows.all()) {
      const cellValue = await row.locator("td").last().textContent();

      if (cellValue == "50") {
        expect(await page.getByRole("table").textContent()).toContain(
          "No data found"
        );
      } else {
        expect(cellValue).toEqual(age1);
      }
    }
  }
});

test("DatePicker ", async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Datepicker").click();

 const calanederInputField=  page.getByPlaceholder('Form Picker');
 await calanederInputField.click();
 await page.locator('[class="day-cell ng-star-inserted"]').getByText('1',{exact:true}).click();
 await expect(calanederInputField).toHaveValue('Dec 1, 2025');
  
});


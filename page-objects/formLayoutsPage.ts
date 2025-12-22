import {test, expect, Page} from '@playwright/test';
import { HelperBase } from './helperBase';

export class FormLayoutsPage extends HelperBase {

  constructor(page: Page) {
   super(page);
    
  }

  async submitUsingTheGridFormWithCredentialsAndSelectOption(
    email: string,
    password: string,
    optionText: string
  ) {
    const usingTheGridForm = this.page.locator("nb-card", {
      hasText: "Using the Grid",
    });

    await usingTheGridForm.getByRole("textbox", { name: "Email" }).fill(email);
    await usingTheGridForm
      .getByRole("textbox", { name: "Password" })
      .fill(password);
    await usingTheGridForm
      .getByRole("radio", { name: optionText })
      .check({ force: true });
    this.waitForTimeInMillisec(2);
    await usingTheGridForm.getByRole("button").click();
  }

  /**
   * This method fills and submits the inline form with the provided details.
   * @param name : SHould be First Name and Last Name
   * @param email :valild email for the test user 
   * @param rememberMe : true or false if users sessoin is saved
   */
  async submitInlineFormWithNameEmailAndCheckbox(
    name: string,
    email: string,
    rememberMe: boolean
  ) {
    const inlineForm = this.page.locator("nb-card", {
      hasText: "Inline form",
    });
    
    await inlineForm.getByRole("textbox", { name: "Jane Doe" }).fill(name);
    await inlineForm.getByRole("textbox", { name: "Email" }).fill(email);

    if (rememberMe) {
      await inlineForm.getByRole("checkbox").check({ force: true });
    }

    await inlineForm.getByRole("button").click();
  }

}

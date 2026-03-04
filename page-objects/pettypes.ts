import { Page, expect } from "@playwright/test";

export class Pettypes {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToPettypes() {
    await this.page.goto("/");
    await this.page.getByTitle("pettypes").click();
    await this.page.getByRole("heading", { name: "Pet Types" }).isVisible();
  }

  /**
   * Edits one or more pet types with the provided names.
   * Iterates through each name, clicks the Edit button, waits for the API response,
   * fills in the pet type name field, submits the form, and verifies the change was applied.
   *
   * @param names - An array of pet type names to set during editing
   *
   */

  async editPettype(names: string[]) {
    for (const name of names) {
      await this.page.getByRole("button", { name: "Edit" }).first().click();
      await this.page.getByText("Edit Pet Type", { exact: true }).isVisible();
      await this.page.waitForResponse(
        "https://petclinic-api.bondaracademy.com/petclinic/api/pettypes/2659",
      );
      const editPetType = this.page.locator("div input#name");
      //await expect(editPetType).toHaveValue("cat");
      await editPetType.fill(name);
      await this.page.locator("[type='submit']").click();
      await expect(this.page.getByRole("textbox").first()).toHaveValue(name);
    }
  }

  async cancelEditPetType() {
    await this.page.getByRole("button", { name: "Edit" }).nth(1).click();
    await this.page.waitForResponse(
      "https://petclinic-api.bondaracademy.com/petclinic/api/pettypes/*",
    );
    const editPetType = this.page.locator("div input#name");
    //await expect(editPetType).toHaveValue("cat");
    await editPetType.fill("moose");
    await expect(editPetType).toHaveValue("moose");
    await this.page.getByRole("button", { name: "Cancel" }).click();
    await expect(this.page.getByRole("textbox").nth(1)).toHaveValue("dog");
  }

  async validatePetNameIsRequired() {
    await this.page.getByRole("button", { name: "Edit" }).nth(2).click();
    await this.page.waitForResponse(
      "https://petclinic-api.bondaracademy.com/petclinic/api/pettypes/*",
    );
    const editPetType = this.page.locator("div input#name");
    await editPetType.clear();
    await expect(editPetType).toHaveValue("");
    await expect(
      this.page.getByText("Name is required", { exact: true }),
    ).toBeVisible();
    await this.page.locator("[type='submit']").click();
    await this.page.getByText("Edit Pet Type", { exact: true }).isVisible();
    await this.page.getByRole("button", { name: "Cancel" }).click();
    expect(this.page).toHaveURL("/pettypes");
  }
}

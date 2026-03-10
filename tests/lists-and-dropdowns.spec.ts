import { test, expect } from "@playwright/test";

test.describe("automate lists and dropdown fields", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Owners" }).click();
    await page.getByText("SEARCH").click();
    await expect(page.getByRole("heading")).toHaveText("Owners");
  });

  test("Validate selected pet types from the list", async ({ page }) => {
    await page.locator('.ownerFullName [href*="/owners/"]').first().click();
    await expect(page.locator(".ownerFullName")).toHaveText("George Franklin");
    await page.getByRole("button", { name: "Edit Pet" }).click();
    await expect(page.getByRole("heading")).toHaveText("Pet");
    await expect(page.locator("#owner_name")).toHaveValue("George Franklin");
    const petTypeField = page.locator('select[name="pettype"]');
    await expect(petTypeField).toHaveValue("cat");
    await petTypeField.click();
    const types = await petTypeField.locator("option").allTextContents();
    for (const type of types) {
      await petTypeField.selectOption(type);
      await expect(petTypeField).toHaveValue(type);
    }

    /*const count= await petTypeField.locator('select option').all();
    for (const cnt of count){
        const type = await cnt.textContent();
        await petTypeField.selectOption(type);
        await expect(petTypeField).toHaveValue(type);
    }
        */
  });

  test("Validate the pet type update", async ({ page }) => {
    await page.locator('.ownerFullName [href*="/owners/"]').nth(2).click();
    const editPetButton = page.getByRole("button", { name: "Edit Pet" }).last();
    await editPetButton.click();
    await expect(page.locator("#name")).toHaveValue("Rosy");
    const petTypeField = page.locator('select[name="pettype"]');
    await expect(petTypeField).toHaveValue("dog");
    await petTypeField.selectOption("bird");
    await expect(petTypeField).toHaveValue("bird");
    await expect(page.locator("#type1")).toHaveValue("bird");
    await page.getByRole("button", { name: "Update Pet" }).click();
    await expect(page.locator("dd").last()).toHaveText("bird");
    await editPetButton.click();
    await expect(page.locator("#name")).toHaveValue("Rosy");
    await expect(petTypeField).toHaveValue("bird");
    await petTypeField.selectOption("dog");
    await expect(petTypeField).toHaveValue("dog");
    await expect(page.locator("#type1")).toHaveValue("dog");
    await page.getByRole("button", { name: "Update Pet" }).click();
    await expect(page.locator("dd").last()).toHaveText("dog");
  });
});

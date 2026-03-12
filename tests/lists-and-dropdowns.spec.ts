import { test, expect } from "@playwright/test";

test.describe("automate lists and dropdown fields", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Owners" }).click();
    await page.getByText("SEARCH").click();
    await expect(page.getByRole("heading")).toHaveText("Owners");
  });

  test.only("Validate selected pet types from the list", async ({ page }) => {
    await page.getByRole("link", { name: "George Franklin" }).click();
    await expect(page.locator(".ownerFullName")).toHaveText("George Franklin");
    await page.locator("app-pet-list", { hasText: "Leo" }).getByRole("button", { name: "Edit Pet" }).click();
    await expect(page.getByRole("heading")).toHaveText("Pet");
    await expect(page.locator("#owner_name")).toHaveValue("George Franklin");
    const petTypeField = page.getByLabel("Type");
    await expect(petTypeField).toHaveValue("cat");
    const types = await petTypeField.locator("option").allTextContents();
    for (const type of types) {
      await petTypeField.selectOption(type);
      await expect(page.locator("#type1")).toHaveValue(type);
    }
  });

  test("Validate the pet type update", async ({ page }) => {
    await page.getByRole("link", { name: "Eduardo Rodriquez" }).click();
    const rosySection = page.locator("app-pet-list", { hasText: "Rosy" });
    const editPetButton = rosySection.getByRole("button", { name: "Edit Pet" });
    await editPetButton.click();
    await expect(page.locator("#name")).toHaveValue("Rosy");
    const petTypeOptionField = page.getByLabel("Type");
    const petType = page.locator("#type1");
    const updatePetType = page.getByRole("button", { name: "Update Pet" });
    await expect(petType).toHaveValue("dog");
    await petTypeOptionField.selectOption("bird");
    await expect(petType).toHaveValue("bird");
    await updatePetType.click();
    await expect(rosySection.locator("dd").nth(2)).toHaveText("bird");
    await editPetButton.click();
    await expect(page.locator("#name")).toHaveValue("Rosy");
    await expect(petType).toHaveValue("bird");
    await petTypeOptionField.selectOption("dog");
    await expect(petType).toHaveValue("dog");
    await updatePetType.click();
    await expect(rosySection.locator("dd").nth(2)).toHaveText("dog");
  });
});

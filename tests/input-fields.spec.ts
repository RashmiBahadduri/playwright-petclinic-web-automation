import { test, expect } from "@playwright/test";

test.describe(" Pet Types Input fields tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTitle("pettypes").click();
    await expect(page.getByRole("heading")).toHaveText("Pet Types");
  });

  test("Update pet type", async ({ page }) => {
    await page.getByRole("button", { name: "Edit" }).first().click();
    await expect(page.getByRole("heading")).toHaveText("Edit Pet Type");
    const editPetTypeInput = page.locator("#name");
    await expect(editPetTypeInput).toHaveValue("cat");
    await editPetTypeInput.fill("rabbit");
    await page.getByRole("button", { name: "Update" }).click();
    const firstPetTypeTextBox = page.getByRole("textbox").first();
    await expect(firstPetTypeTextBox).toHaveValue("rabbit");
    await page.getByRole("button", { name: "Edit" }).first().click();
    await expect(editPetTypeInput).toHaveValue("rabbit");
    await editPetTypeInput.fill("cat");
    await page.getByRole("button", { name: "Update" }).click();
    await expect(firstPetTypeTextBox).toHaveValue("cat");
  });

  test("Cancel pet type update", async ({ page }) => {
    await page.getByRole("button", { name: "Edit" }).nth(1).click();
    const editPetTypeInput = page.locator("#name");
    await expect(editPetTypeInput).toHaveValue("dog");
    await editPetTypeInput.fill("moose");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("textbox").nth(1)).toHaveValue("dog");
  });

  test("Validation of Pet Type Name is required", async ({ page }) => {
    await page.getByRole("button", { name: "Edit" }).nth(2).click();
    const editPetTypeInput = page.locator("#name");
    await expect(editPetTypeInput).toHaveValue("lizard");
    await editPetTypeInput.clear();
    await expect(editPetTypeInput).toBeEmpty();
    await expect(page.locator(".help-block")).toHaveText("Name is required");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("heading")).toHaveText("Pet Types");
    await expect(page.getByRole("textbox").nth(2)).toHaveValue("lizard");
  });
});

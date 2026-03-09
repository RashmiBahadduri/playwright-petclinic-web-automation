import { test, expect } from "@playwright/test";

test.describe("validate checkboxes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Veterinarians" }).click();
    await page.getByText("ALL").click();
  });

  test("Validate selected specialities", async ({ page }) => {
    await expect(page.getByRole("heading")).toHaveText("Veterinarians");
    await page.getByRole("button", { name: "Edit Vet" }).nth(1).click();
    const specialitiesDropdown = page.locator(".selected-specialties");
    await expect(specialitiesDropdown).toHaveText("radiology");
    await specialitiesDropdown.click();
    await expect(page.getByRole("checkbox", { name: "radiology" })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: "surgery" })).not.toBeChecked();
    await expect(page.getByRole("checkbox", { name: "dentistry" })).not.toBeChecked();
    await page.getByRole("checkbox", { name: "surgery" }).check();
    await page.getByRole("checkbox", { name: "radiology" }).uncheck();
    await expect(page.locator(".selected-specialties")).toHaveText("surgery");
    await page.getByRole("checkbox", { name: "dentistry" }).check();
    await expect(page.locator(".selected-specialties")).toHaveText("surgery, dentistry");
  });

  test("Select all specialities", async ({ page }) => {
    await page.getByRole("button", { name: "Edit Vet" }).nth(3).click();
    const specialitiesDropdown = page.locator(".selected-specialties");
    await expect(specialitiesDropdown).toHaveText("surgery");
    await specialitiesDropdown.click();
    const allCheckboxes = await page.getByRole("checkbox").all();
    for (const box of allCheckboxes) {
      await box.check();
      await expect(box).toBeChecked();
    }
    await expect(page.locator(".selected-specialties")).toHaveText("surgery, radiology, dentistry");
  });

  test("uncheck all specialities", async ({ page }) => {
    await page.getByRole("button", { name: "Edit Vet" }).nth(2).click();
    const specialitiesDropdown = page.locator(".selected-specialties");
    await expect(specialitiesDropdown).toHaveText("dentistry, surgery");
    await specialitiesDropdown.click();
    const allCheckboxes = await page.getByRole("checkbox").all();
    for (const box of allCheckboxes) {
      await box.uncheck();
      await expect(box).not.toBeChecked();
    }
    await expect(specialitiesDropdown).toBeEmpty();
  });
});

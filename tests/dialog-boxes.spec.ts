import { test, expect } from "@playwright/test";

test.describe("Dialog Boxes tests", () => {
  test("Add and delete pet type", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Pet Types" }).click();
    await expect(page.getByRole("heading")).toHaveText("Pet Types");
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.locator("app-pettype-add").getByRole("heading")).toHaveText("New Pet Type");
    await expect(page.locator("label")).toHaveText("Name");
    await expect(page.locator("app-pettype-add").getByRole("textbox")).toBeVisible();
    await page.locator("app-pettype-add").getByRole("textbox").fill("pig");
    await page.getByText("Save").click();
    const newPetRow = page.locator("tr").filter({ hasText: "EditDelete" }).last();
    await expect(newPetRow.getByRole("textbox")).toHaveValue("pig");
    page.on("dialog", async (dialog) => {
      console.log(dialog.message());
      expect(dialog.message()).toEqual("Delete the pet type?");
      dialog.accept();
    });
    await newPetRow.getByRole("button", { name: "Delete" }).click();
    await expect(newPetRow.getByRole("textbox")).not.toHaveValue("pig");
  });
});

import { test, expect } from "@playwright/test";

test.describe("validate checkboxes", () => {

    test.beforeEach(async ({ page }) => {
      await page.goto("/");
     await page.getByRole('button', { name: 'Veterinarians' }).click();
        await page.locator('a:has-text("ALL")').click();
    });

  test("Validate selected specialities", async ({ page }) => {    

    
    await expect(page.getByRole("heading")).toHaveText("Veterinarians");
    await page.getByRole("button", { name: "Edit Vet" }).nth(1).click();
    await expect(page.locator('label:has-text("Specialties")')).toBeVisible();
    await expect(page.locator(".selected-specialties")).toHaveText("radiology");
    await page.locator(".dropdown-arrow").click();
    await expect(page.getByRole("checkbox", { name: "radiology" })).toBeChecked();
    await expect( page.getByRole("checkbox", { name: "surgery" })).not.toBeChecked();
    await expect( page.getByRole("checkbox", { name: "dentistry" })).not.toBeChecked();
    await page.getByRole("checkbox", { name: "surgery" }).check();
    await page.getByRole("checkbox", { name: "radiology" }).uncheck();
    await expect(page.locator(".selected-specialties")).toHaveText("surgery");
    await page.getByRole("checkbox", { name: "dentistry" }).check();
    await expect(page.locator(".selected-specialties")).toContainText("surgery, dentistry");
  });

  test("Select all specialities", async ({ page }) => {    

    await page.getByRole("button", { name: "Edit Vet" }).nth(3).click();
    await expect(page.locator('label:has-text("Specialties")')).toBeVisible();
    await expect(page.locator(".selected-specialties")).toHaveText("surgery");
    await page.locator(".dropdown-arrow").click();
    const allCheckboxes = await page.getByRole('checkbox').all();
    for (const box of allCheckboxes){
        await box.check();
        expect(box.isChecked()).toBeTruthy();
    }
    await expect(page.locator(".selected-specialties")).toContainText("surgery, radiology, dentistry");

  });


  test( "uncheck all specialities", async ({ page }) => {    

    await page.getByRole("button", { name: "Edit Vet" }).nth(2).click();
    await expect(page.locator(".selected-specialties")).toContainText("dentistry, surgery");
     await page.locator(".dropdown-arrow").click();
     const allCheckboxes = await page.getByRole('checkbox').all();
    for (const box of allCheckboxes){
        if (!box.uncheck()){
        await box.click({force : true});
        expect(box.isChecked()).toBeFalsy();
        }
    }
     /*await page.getByRole("checkbox", { name: "surgery" }).uncheck();
     await page.getByRole("checkbox", { name: "dentistry" }).uncheck();
     await expect(page.getByRole("checkbox", { name: "radiology" })).not.toBeChecked();
    await expect( page.getByRole("checkbox", { name: "surgery" })).not.toBeChecked();
    await expect( page.getByRole("checkbox", { name: "dentistry" })).not.toBeChecked();
    */
    await expect(page.locator(".selected-specialties")).toBeEmpty();   



  });




});

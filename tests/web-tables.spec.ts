import { test, expect } from "@playwright/test";

test.describe("Automate web tables", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Owners" }).click();
    await page.getByText("SEARCH").click();
  });

  test("Validate the pet name city of the owner", async ({ page }) => {
    const targetOwnerRow = page.getByRole("row", { name: "Jeff Black" });
    await expect(targetOwnerRow).toContainText("Monona");
    await expect(targetOwnerRow).toContainText("Lucky");
  });

  test("Validate owners count of the Madison city", async ({ page }) => {
    const targetOwnerRow = page.locator("table tr").filter({ hasText: "Madison" });
    //const count = await targetOwnerRow.count();
    await expect(targetOwnerRow).toHaveCount(4);
  });

  test("Validate search by Last name", async ({ page }) => {
    const lastNamSearchTextField = page.getByRole("textbox");
    await lastNamSearchTextField.fill("Black");
    const findOwnerButton = page.getByRole("button", { name: "Find Owner" });
    await findOwnerButton.click();
    const ownerNameColumn = page.locator("td.ownerFullName");
    await expect(ownerNameColumn.nth(0)).toContainText("Black");
    await lastNamSearchTextField.clear();
    await lastNamSearchTextField.fill("Davis");
    await findOwnerButton.click();
    await expect(ownerNameColumn.nth(0)).toContainText("Davis");
    await expect(ownerNameColumn.nth(1)).toContainText("Davis");
    await lastNamSearchTextField.clear();
    await lastNamSearchTextField.fill("Es");
    await findOwnerButton.click();
    await expect(ownerNameColumn.nth(0)).toContainText("Es");
    await expect(ownerNameColumn.nth(1)).toContainText("Es");
    await lastNamSearchTextField.clear();
    await lastNamSearchTextField.fill("Playwright");
    await findOwnerButton.click();
    await expect(page.getByText('No owners with LastName starting with "Playwright"')).toHaveText('No owners with LastName starting with "Playwright"');
  });

  test("Validate phone number and pet name on the pet owner page", async ({ page }) => {
    const targetOwnerPetName = await page.getByRole("row", { name: "6085552765" }).locator("td").nth(4).textContent();
    await page.getByRole("row", { name: "6085552765" }).getByRole("link").click();
    await expect(page.locator("app-owner-detail").locator("tr", { hasText: "Telephone" })).toContainText("6085552765");
    await expect(page.locator("app-pet-list dd").nth(0)).toHaveText(targetOwnerPetName!);
  });

  test("Validate pets of the madison city", async ({ page }) => {
    let petLists = [];
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/owners");
    const targetPetRow = await page.getByRole("row", { name: "Madison" }).all();
    for (let row of targetPetRow) {
      const petNameCell = await row.locator("td").last().textContent();
      petLists.push(petNameCell?.trim());
    }
    await expect(petLists).toEqual(["Leo", "George", "Mulligan", "Freddy"]);
  });

  test("Validate specialty update", async ({ page }) => {
    await page.getByRole("button", { name: "Veterinarians" }).click();
    await page.getByText("ALL").click();
    const targetVeterinarianRow = page.getByRole("row", { name: " Rafael Ortega " });
    let specialtyValue = await targetVeterinarianRow.locator("td").nth(1).innerText();
    await expect(specialtyValue).toEqual("surgery");
    await page.getByRole("link", { name: "Specialties" }).click();
    await expect(page.getByRole("heading")).toHaveText("Specialties");
    await page.getByRole("button", { name: "Edit" }).nth(1).click();
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/specialties/*");
    await expect(page.getByRole("heading")).toHaveText("Edit Specialty");
    const editSpecialtyTextField = page.locator("#name");
    await expect(editSpecialtyTextField).toHaveValue("surgery");
    await editSpecialtyTextField.clear();
    await editSpecialtyTextField.fill("dermatalogy");
    await page.getByRole("button", { name: "Update" }).click();
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/specialties");
    await expect(page.getByRole("textbox").nth(1)).toHaveValue("dermatalogy");
    await page.getByRole("button", { name: "Veterinarians" }).click();
    await page.getByText("ALL").click();
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/vets");
    specialtyValue = await targetVeterinarianRow.locator("td").nth(1).innerText();
    await expect(specialtyValue).toEqual("dermatalogy");
    await page.getByRole("link", { name: "Specialties" }).click();
    await page.getByRole("button", { name: "Edit" }).nth(1).click();
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/specialties/*");
    await editSpecialtyTextField.clear();
    await editSpecialtyTextField.fill("surgery");
    await page.getByRole("button", { name: "Update" }).click();
  });

  test("Validate specialty lists", async ({ page }) => {
    const specialties = [];
    await page.getByRole("link", { name: "Specialties" }).click();
    await page.getByRole("button", { name: "Add" }).click();
    await page.getByRole("textbox").last().fill("oncology");
    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/specialties");
    const specialtyNames = await page.locator('[name="spec_name"]').all();
    for (const names of specialtyNames) {
      const value = await names.inputValue();
      specialties.push(value);
    }
    await page.getByRole("button", { name: "Veterinarians" }).click();
    await page.getByText("ALL").click();
    await page.getByRole("row", { name: " Sharon Jenkins " }).getByRole("button", { name: "Edit Vet" }).click();
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/specialties");
    await page.locator(".dropdown-display").click();
    const targetVetSpecialties = await page.locator(".dropdown-content").allInnerTexts();
    await expect(specialties).toEqual(targetVetSpecialties[0].split("\n"));
    await page.getByRole("checkbox", { name: "oncology" }).check();
    await page.locator(".dropdown-arrow").click();
    await page.getByRole("button", { name: "Save Vet" }).click();
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/vets/*");
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/vets");
    const targetVetSpecialty = page.getByRole("row", { name: " Sharon Jenkins " }).locator("td").nth(1);
    await expect(targetVetSpecialty).toHaveText("oncology");
    await page.getByRole("link", { name: "Specialties" }).click();
    await page.locator("button").filter({ hasText: "Delete" }).last().click();
    await page.getByRole("button", { name: "Veterinarians" }).click();
    await page.getByText("ALL").click();
    await expect(targetVetSpecialty).toBeEmpty();
  });
});

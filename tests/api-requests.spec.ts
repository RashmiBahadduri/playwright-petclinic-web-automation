import { test, expect, request } from "@playwright/test";

test.describe("validate api requests", () => {
  test("validation of delete specialty", async ({ request, page }) => {
    const response = await request.post("https://petclinic-api.bondaracademy.com/petclinic/api/specialties", {
      data: {
        name: "api testing expert",
      },
    });
    expect(response.status()).toEqual(201);
    const specialties = [];
    await page.goto("/");
    await page.getByRole("link", { name: "Specialties" }).click();
    const specialtyNames = await page.locator('[name="spec_name"]').all();
    for (const names of specialtyNames) {
      const value = await names.inputValue();
      specialties.push(value);
    }
    expect(specialties).toContain("api testing expert");
    await page.getByRole("row", { name: "api testing expert" }).getByRole("button", { name: "Delete" }).click();
    await expect(page.getByRole("row", { name: "api testing expert" })).not.toBeVisible();
  });

  test("Add and delete Veterinarian", async ({ request, page }) => {
    const response = await request.post("https://petclinic-api.bondaracademy.com/petclinic/api/vets", {
      data: {
        firstName: "Ben",
        lastName: "Stiller",
        specialties: [],
      },
    });
    const responseBody = await response.json();
    const vetId = responseBody.id;
    expect(response.status()).toEqual(201);
    expect(responseBody).toHaveProperty("firstName", "Ben");
    expect(responseBody).toHaveProperty("lastName", "Stiller");
    await page.goto("/");
    await page.getByRole("button", { name: "Veterinarians" }).click();
    await page.getByText("ALL").click();
    const targetVetRow = page.getByRole("row", { name: "Ben Stiller" });
    await expect(targetVetRow).toBeVisible();
    await expect(targetVetRow.locator("td").nth(1)).toBeEmpty();
    await targetVetRow.getByRole("button", { name: "Edit Vet" }).click();
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/specialties");
    await page.locator(".dropdown-arrow").click();
    await page.getByRole("checkbox", { name: "dentistry" }).check();
    await page.getByRole("button", { name: "Save Vet" }).click();
    await expect(targetVetRow.locator("td").nth(1)).toHaveText("dentistry");
    const deleteResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${vetId}`);
    expect(deleteResponse.status()).toEqual(204);
    const vetResponse = await request.get("https://petclinic-api.bondaracademy.com/petclinic/api/vets");
    const verResponseBody = await vetResponse.json();
    expect(verResponseBody).not.toHaveProperty("firstName", "Ben");
    expect(verResponseBody).not.toHaveProperty("lastName", "Stiller");
  });

  test("New specialty is displayed", async ({ request, page }) => {
    const specialtyResponse = await request.post("https://petclinic-api.bondaracademy.com/petclinic/api/specialties", {
      data: {
        name: "api testing ninja",
      },
    });
    expect(specialtyResponse.status()).toEqual(201);
    const specialtyResponseBody = await specialtyResponse.json();
    const specialtyId = await specialtyResponseBody.id;
    const vetResponse = await request.post("https://petclinic-api.bondaracademy.com/petclinic/api/vets", {
      data: {
        firstName: "Ana",
        lastName: "Ray",
        specialties: [
          {
            id: 4632,
            name: "surgery",
          },
        ],
      },
    });
    expect(vetResponse.status()).toEqual(201);
    const responseBody = await vetResponse.json();
    const vetId = responseBody.id;
    await page.goto("/");
    await page.getByRole("button", { name: "Veterinarians" }).click();
    await page.getByText("ALL").click();
    const targetVetRow = page.getByRole("row", { name: "Ana Ray" });
    await expect(targetVetRow).toBeVisible();
    await expect(targetVetRow.locator("td").nth(1)).toHaveText("surgery");
    await targetVetRow.getByRole("button", { name: "Edit Vet" }).click();
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/specialties");
    await page.locator(".dropdown-arrow").click();
    await page.getByRole("checkbox", { name: "surgery" }).uncheck();
    await page.getByRole("checkbox", { name: "api testing ninja" }).check();
    await page.getByRole("button", { name: "Save Vet" }).click();
    await expect(targetVetRow.locator("td").nth(1)).toHaveText("api testing ninja");
    const deleteVetResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${vetId}`);
    expect(deleteVetResponse.status()).toEqual(204);
    const deleteSpecialtyResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/specialties/${specialtyId}`);
    expect(deleteSpecialtyResponse.status()).toEqual(204);
  });
});

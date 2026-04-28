import { test, expect } from "@playwright/test";

test.describe("Automtae tests for datepicker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Owners" }).click();
    await page.getByText("SEARCH").click();
  });

  test("select the desired date in the calendar", async ({ page }) => {
    await page.getByRole("link", { name: "Harold Davis" }).click();
    await page.getByRole("button", { name: "Add New Pet" }).click();
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/owners/*");
    await page.getByLabel("Name").fill("Tom");
    await expect(page.locator(".glyphicon-ok")).toBeVisible();
    await page.getByRole("button", { name: "Open calendar" }).click();
    await page.getByRole("button", { name: "Choose month and year" }).click();
    await page.getByRole("button", { name: "Previous 24 years" }).click();
    await page.getByText("2014").click();
    await page.getByText("MAY").click();
    await page.getByText("2", { exact: true }).click();
    await expect(page.locator('[name="birthDate"]')).toHaveValue("2014/05/02");
    await page.getByLabel("Type", { exact: true }).selectOption("dog");
    await page.getByRole("button", { name: "Save Pet" }).click();
    await expect(page.getByText("Tom", { exact: true })).toBeVisible();
    const tomPetSection = page.locator("app-pet-list", { hasText: "Tom" });
    await expect(tomPetSection.locator("dd").nth(0)).toHaveText("Tom");
    await expect(tomPetSection.locator("dd").nth(1)).toHaveText("2014-05-02");
    await tomPetSection.getByRole("button", { name: "Delete Pet" }).click();
    await expect(tomPetSection).not.toBeVisible();
  });

  test.only("select the dates of visits and validate dates order", async ({ page }) => {
    await page.getByRole("link", { name: "Jean Coleman" }).click();
    const samanthaPetSection = page.locator("app-pet-list", { hasText: "Samantha" });
    await samanthaPetSection.getByRole("button", { name: "Add Visit" }).click();
    await expect(page.getByRole("heading")).toContainText("New Visit");
    await expect(page.locator("tr").locator("td").first()).toHaveText("Samantha");
    await expect(page.locator("tr").locator("td").nth(3)).toHaveText("Jean Coleman");
    await page.getByRole("button", { name: "Open calendar" }).click();
    const date = new Date();
    const currentDate = date.toLocaleString("en-US", { day: "2-digit" });
    const currentMonth = date.toLocaleString("en-US", { month: "2-digit" });
    const currentYear = date.getFullYear().toString();
    const expectedVisitDate = `${currentYear}/${currentMonth}/${currentDate}`;
    await page.getByText(currentDate, { exact: true }).click();
    await expect(page.locator('[name="date"]')).toHaveValue(expectedVisitDate);
    await page.locator("#description").fill("dermatologists visit");
    await page.getByRole("button", { name: "Add Visit" }).click();
    const dermVisitRow = samanthaPetSection.locator("app-visit-list").getByRole("row", { name: "dermatologists visit" });
    await expect(dermVisitRow.locator("td").nth(0)).toHaveText(`${currentYear}-${currentMonth}-${currentDate}`);
    await samanthaPetSection.getByRole("button", { name: "Add Visit" }).click();
    await page.getByRole("button", { name: "Open calendar" }).click();
    date.setDate(date.getDate() - 45);
    const newDate = date.getDate().toString();
    const massageTherapyMonth = date.toLocaleString("en-US", { month: "2-digit" });
    const expectedYear = date.getFullYear().toString();
    const expectedMonthYear = `${massageTherapyMonth} ${expectedYear}`;
    let calendarMonthYear = await page.getByRole("button", { name: "Choose month and year" }).textContent();
    while (!calendarMonthYear?.includes(expectedMonthYear)) {
      await page.getByRole("button", { name: "Previous month" }).click();
      calendarMonthYear = await page.getByRole("button", { name: "Choose month and year" }).textContent();
    }
    await page.getByText(newDate, { exact: true }).click();
    await page.locator("#description").fill("massage therapy");
    await page.getByRole("button", { name: "Add Visit" }).click();
    const dermatologistVisitDate = await samanthaPetSection.locator("app-visit-list").getByRole("row", { name: "dermatologists visit" }).locator("td").nth(0).textContent();
    const massageTherapyVisitDate = await samanthaPetSection.locator("app-visit-list").getByRole("row", { name: "massage therapy" }).locator("td").nth(0).textContent();
    await expect(samanthaPetSection.locator("app-visit-list").locator("tr").nth(1)).toContainText(dermatologistVisitDate!);
    await expect(samanthaPetSection.locator("app-visit-list").locator("tr").nth(2)).toContainText(massageTherapyVisitDate!);
    const dermatologistVisit = new Date(dermatologistVisitDate!);
    const massageTherapyVisit = new Date(massageTherapyVisitDate!);
    expect(dermatologistVisit > massageTherapyVisit).toBeTruthy();
    await samanthaPetSection.locator("app-visit-list").getByRole("row", { name: "massage therapy" }).getByRole("button", { name: "Delete Visit" }).click();
    await samanthaPetSection.locator("app-visit-list").getByRole("row", { name: "dermatologists visit" }).getByRole("button", { name: "Delete Visit" }).click();
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/visits/*");
    await expect(samanthaPetSection.locator("app-visit-list").getByRole("row", { name: "massage therapy" })).not.toBeVisible();
    await expect(samanthaPetSection.locator("app-visit-list").getByRole("row", { name: "dermatologists visit" })).not.toBeVisible();
  });
});

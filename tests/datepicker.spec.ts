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
    await page.getByLabel("Name").fill("Tom");
    await expect(page.locator(".glyphicon-ok")).toBeVisible();
    await page.locator(".mat-datepicker-toggle").click();
    let targetMonthYear = await page.locator(".mdc-button__label span").textContent();
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const monthToSelect = date.getMonth();
    const displayedMonth = monthToSelect + 1;
    date.setFullYear(date.getFullYear() - 12);
    const expectedYear = date.getFullYear();
    const day = "2";
    const expectedMonthYear = `0${displayedMonth} ${expectedYear}`;
    while (!targetMonthYear?.includes(expectedMonthYear)) {
      await page.getByRole("button", { name: "Previous month" }).click();
      targetMonthYear = await page.locator(".mdc-button__label span").textContent();
    }
    await page.getByText(day, { exact: true }).click();
    await expect(page.locator('[name="birthDate"]')).toHaveValue(`${expectedYear}/0${displayedMonth}/0${day}`);
    await page.getByLabel("Type", { exact: true }).selectOption("dog");
    await page.getByRole("button", { name: "Save Pet" }).click();
    await expect(page.getByText("Tom", { exact: true })).toBeVisible();
    const tomPetSection = page.locator("app-pet-list", { hasText: "Tom" });
    await expect(tomPetSection.locator("dd").nth(0)).toHaveText("Tom");
    await expect(tomPetSection.locator("dd").nth(1)).toHaveText(`${expectedYear}-0${displayedMonth}-0${day}`);
    await tomPetSection.getByRole("button", { name: "Delete Pet" }).click();
    await expect(tomPetSection).not.toBeVisible();
  });

  test("select the dates of visits and validate dates order", async ({ page }) => {
    await page.getByRole("link", { name: "Jean Coleman" }).click();
    const targetPetSection = page.locator("app-pet-list", { hasText: "Samantha" });
    await targetPetSection.getByRole("button", { name: "Add Visit" }).click();
    await expect(page.getByRole("heading")).toContainText("New Visit");
    await expect(page.locator("tr").locator("td").first()).toHaveText("Samantha");
    await expect(page.locator("tr").locator("td").nth(3)).toHaveText("Jean Coleman");
    await page.locator(".mat-mdc-button-touch-target").click();
    const date = new Date();
    const currentDate = date.getDate().toString();
    const currentMonth = (date.getMonth() + 1).toString();
    const currentYear = date.getFullYear().toString();
    const expectedVisitDate = `${currentYear}/0${currentMonth}/${currentDate}`;
    await page.getByText(currentDate, { exact: true }).click();
    await expect(page.locator('[name="date"]')).toHaveValue(expectedVisitDate);
    await page.locator("#description").fill("dermatologists visit");
    await page.getByRole("button", { name: "Add Visit" }).click();
    const dermVisitRow = targetPetSection.locator("app-visit-list").getByRole("row", { name: "dermatologists visit" });
    await expect(dermVisitRow.locator("td").nth(0)).toHaveText(`${currentYear}-0${currentMonth}-${currentDate}`);
    await targetPetSection.getByRole("button", { name: "Add Visit" }).click();
    await page.locator(".mat-mdc-button-touch-target").click();
    date.setDate(date.getDate() - 45);
    const newDate = date.getDate().toString();
    const expectedMonth = (date.getMonth() + 1).toString();
    const expectedYear = date.getFullYear().toString();
    const expectedMonthYear = `${expectedMonth} ${expectedYear}`;
    let calendarMonthYear = await page.locator(".mat-calendar-hidden-label").textContent();
    while (!calendarMonthYear?.includes(expectedMonthYear)) {
      await page.getByRole("button", { name: "Previous month" }).click();
      calendarMonthYear = await page.locator(".mat-calendar-hidden-label").textContent();
    }
    await page.getByText(newDate, { exact: true }).click();
    await page.locator("#description").fill("massage therapy");
    await page.getByRole("button", { name: "Add Visit" }).click();
    const therapyVisitDate = await targetPetSection.locator("app-visit-list").getByRole("row", { name: "massage therapy" }).locator("td").nth(0).textContent();
    const dermVisitDate = await targetPetSection.locator("app-visit-list").getByRole("row", { name: "dermatologists visit" }).locator("td").nth(0).textContent();
    const dermDate = new Date(dermVisitDate!);
    const dermDateString = dermDate.toISOString().split("T")[0];
    const therapyDate = new Date(therapyVisitDate!);
    const therapyDateString = therapyDate.toISOString().split("T")[0];
    if (therapyDateString < dermDateString) {
      await expect(targetPetSection.locator("app-visit-list").locator("tr").nth(1)).toContainText(dermVisitDate!);
    }
    await targetPetSection.locator("app-visit-list").getByRole("row", { name: "massage therapy" }).getByRole("button", { name: "Delete Visit" }).click();
    await targetPetSection.locator("app-visit-list").getByRole("row", { name: "dermatologists visit" }).getByRole("button", { name: "Delete Visit" }).click();
    await page.waitForResponse("https://petclinic-api.bondaracademy.com/petclinic/api/visits/*");
    await expect(targetPetSection.locator("app-visit-list").getByRole("row", { name: "massage therapy" })).not.toBeVisible();
    await expect(targetPetSection.locator("app-visit-list").getByRole("row", { name: "dermatologists visit" })).not.toBeVisible();
  });
});

import { test, expect } from "@playwright/test";
import ownerData from "../test-data/owners.json";
import jessData from "../test-data/ownerJess.json";

test.beforeEach(async ({ page }) => {
  await page.route("*/**/api/owners", async (route) => {
    await route.fulfill({
      body: JSON.stringify(ownerData),
    });
  });

  await page.route("*/**/api/vets", async (route) => {
    const response = await route.fetch();
    const responsebody = await response.json();
    ((responsebody[5].specialties = [
      {
        id: 4633,
        name: "dentistry",
      },
      {
        id: 4632,
        name: "surgery",
      },
      {
        id: 4631,
        name: "radiology",
      },
      {
        id: 4634,
        name: "massage therapy",
      },
      {
        id: 4635,
        name: "dermatology",
      },
      {
        id: 4636,
        name: "vaccination",
      },
      {
        id: 4637,
        name: "pre surgery",
      },
      {
        id: 4638,
        name: "post surgery",
      },
      {
        id: 4639,
        name: "emergency care",
      },
      {
        id: 4640,
        name: "dental care",
      },
    ]),
      await route.fulfill({
        body: JSON.stringify(responsebody),
      }));
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Owners" }).click();
  await page.getByText("SEARCH").click();
});

test("validate owners list and visit list count", async ({ page }) => {
  const targetOwnerRow = page.getByRole("row", { name: "Jess Walt" });
  const ownerName = await targetOwnerRow.locator("td").first().textContent();
  const ownerAddress = await targetOwnerRow.locator("td").nth(1).textContent();
  const ownerCity = await targetOwnerRow.locator("td").nth(2).textContent();
  const ownerTelephone = await targetOwnerRow.locator("td").nth(3).textContent();
  const ownerFirstPet = await targetOwnerRow.locator("td").last().locator("tr").first().textContent();
  const ownerSecondPet = await targetOwnerRow.locator("td").last().locator("tr").last().textContent();
  await expect(page.locator("td.ownerFullName")).toHaveCount(2);
  await page.route("*/**/api/owners/*", async (route) => {
    await route.fulfill({
      body: JSON.stringify(jessData),
    });
  });
  await page.getByRole("link", { name: "Jess Walt" }).click();
  await expect(page.locator("app-owner-detail").getByRole("row", { name: "Name" }).nth(0)).toContainText(ownerName!);
  await expect(page.locator("app-owner-detail").getByRole("row", { name: "Address" })).toContainText(ownerAddress!);
  await expect(page.locator("app-owner-detail").getByRole("row", { name: "City" })).toContainText(ownerCity!);
  await expect(page.locator("app-owner-detail").getByRole("row", { name: "Telephone" })).toContainText(ownerTelephone!);
  await expect(page.locator("app-pet-list").getByRole("row", { name: "Name" }).nth(0)).toContainText(ownerFirstPet!);
  await expect(page.locator("app-pet-list").getByRole("row", { name: "Name" }).nth(1)).toContainText(ownerSecondPet!);
  const lunaPetSection = page.locator("app-pet-list", { hasText: "Luna" });
  await expect(lunaPetSection.getByRole("row", { name: "Name" })).toContainText(ownerFirstPet!);
  await expect(lunaPetSection.locator("app-visit-list table > tr")).toHaveCount(10);
});

test("validate veterinarian specialties", async ({ page }) => {
  await page.getByRole("button", { name: "Veterinarians" }).click();
  await page.getByText("ALL").click();
  const sharonRow = page.getByRole("row", { name: "Sharon Jenkins" });
  await expect(sharonRow.locator("td").nth(1).locator("div")).toHaveCount(10);
});

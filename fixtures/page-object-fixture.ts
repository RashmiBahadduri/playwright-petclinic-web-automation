import { Pettypes } from "../page-objects/pettypes";
import { test as base } from "@playwright/test";

type PageFixture = {
  pettypes: Pettypes;
};

export const test = base.extend<PageFixture>({
  pettypes: async ({ page }, use) => {
    const pettypes = new Pettypes(page);
    await use(pettypes);
  },
});

export { expect } from "@playwright/test";

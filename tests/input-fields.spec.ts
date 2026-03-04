import { test, expect } from "../fixtures/page-object-fixture";

test.describe("Input fields tests", () => {
  test("Update pet type", async ({ pettypes, page }) => {
    let petName: string[] = ["rabbit", "cat"];

    await pettypes.navigateToPettypes();

    await pettypes.editPettype(petName);
  });

  test("Cancel pet type update", async ({ pettypes, page }) => {
    await pettypes.navigateToPettypes();
    await pettypes.cancelEditPetType();
  });

  test("Validtaion of Pet Type Name is required", async ({
    pettypes,
    page,
  }) => {
    await pettypes.navigateToPettypes();
    await pettypes.validatePetNameIsRequired();
  });
});

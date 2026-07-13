import { test, expect } from "@playwright/test";
import { signUp, syntheticAccount } from "./support/accounts";
import { monitorBrowserErrors } from "./support/console-monitor";
import { startDraft, saveFoundation, addOutcome } from "./support/workflow";

test("denies another account access to setup and resulting season records", async ({ browser }) => {
  const ownerPage = await (await browser.newContext()).newPage();
  const ownerErrors = monitorBrowserErrors(ownerPage);
  const owner = syntheticAccount("owner-a");
  const title = `Private plan ${owner.email}`;
  await signUp(ownerPage, owner);
  await startDraft(ownerPage, title);
  const draftUrl = ownerPage.url();
  await saveFoundation(ownerPage, title, "This private intent must stay with owner A.");
  await ownerPage.getByPlaceholder("Add a proposed goal").fill("Private goal for owner A");
  await ownerPage.getByRole("button", { name: "Add goal" }).click();
  await addOutcome(ownerPage, "Private goal for owner A", "boolean", "Private outcome for owner A");
  await ownerPage.getByRole("button", { name: "Review setup" }).click();
  await ownerPage.getByRole("button", { name: "Confirm and lock setup" }).click();
  const completionUrl = ownerPage.url();
  await ownerPage.getByRole("button", { name: "Create draft season" }).click();
  const seasonUrl = ownerPage.url();

  const otherContext = await browser.newContext();
  const otherPage = await otherContext.newPage();
  const otherErrors = monitorBrowserErrors(otherPage);
  const other = syntheticAccount("owner-b");
  await signUp(otherPage, other);
  for (const url of [draftUrl, completionUrl, seasonUrl]) {
    const response = await otherPage.goto(url);
    expect(response?.status()).toBe(404);
    await expect(otherPage.locator("body")).not.toContainText("Private plan");
    await expect(otherPage.locator("body")).not.toContainText("Private intent");
  }
  await otherPage.goto("/season");
  await expect(otherPage.locator("body")).not.toContainText(title);
  await expect(otherPage.locator("body")).not.toContainText("Private goal for owner A");
  await otherErrors();
  await ownerErrors();
  await ownerPage.context().close();
  await otherContext.close();
});
